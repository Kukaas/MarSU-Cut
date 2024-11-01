// UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spin, Tooltip, Typography } from "antd";
import { toast } from "sonner";

import { Maximize2Icon, PlusCircle } from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";

// others
import ToasterError from "@/lib/Toaster";
import axios from "axios";
import { useEffect, useState } from "react";

import AddProduction from "@/components/components/forms/AddProduction";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/custom-components/CustomTable";
import ProductionChart from "../production-components/ProductionChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductionPerformance from "../production-components/ProductionPerformance";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import DeleteDialog from "@/components/components/custom-components/DeleteDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PrintableForm from "@/hooks/PrintableForm";

const Productions = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/v1/production/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const data = res.data.productions;
        if (res.status === 200) {
          setData(data);
          setOriginalData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductions();
  }, []);

  useEffect(() => {
    if (searchValue) {
      const lowercasedSearchValue = searchValue.toLowerCase();

      const filteredData = originalData.filter((production) => {
        return (
          production.productType
            .toLowerCase()
            .includes(lowercasedSearchValue) ||
          production.level.toLowerCase().includes(lowercasedSearchValue)
        );
      });

      setData(filteredData);
    } else {
      setData(originalData);
    }
  }, [searchValue, originalData]);

  const handleDelete = async (production) => {
    try {
      setDeleteLoading(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/production/delete/${production._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success(`Production with ID ${production._id} deleted.`);

        setData((prevData) => {
          return prevData.filter(
            (deletedProduction) => deletedProduction._id !== production._id
          );
        });
      } else {
        ToasterError();
      }
    } catch (error) {
      ToasterError({
        description: "Please check you internet connection and try again.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: "productType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product Type" />
      ),
    },
    {
      accessorKey: "size",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Size" />
      ),
    },
    {
      accessorKey: "level",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Level" />
      ),
    },
    {
      accessorKey: "productionDateFrom",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="From" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("productionDateFrom"));
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "productionDateTo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="To" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("productionDateTo"));
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "rawMaterialsUsed",
      header: "Raw Materials Used",
      cell: ({ row }) => (
        <ul>
          {Array.isArray(row.original.rawMaterialsUsed) ? (
            row.original.rawMaterialsUsed.map((rawMaterial) => (
              <li key={rawMaterial.type}>
                {rawMaterial.type} - {rawMaterial.quantity}
              </li>
            ))
          ) : (
            <li>No raw materials used</li>
          )}
        </ul>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const production = row.original;
        return (
          <div className="flex space-x-2">
            <Tooltip title="Delete production">
              <DeleteDialog
                item={`raw material with ID ${production?._id}`}
                handleDelete={() => handleDelete(production)}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const handleProductionAdded = (newProduction) => {
    setData((prevData) => [...prevData, newProduction]);
  };

  return (
    <Spin
      spinning={deleteLoading}
      indicator={
        <LoadingOutlined
          className="dark:text-white"
          style={{
            fontSize: 48,
          }}
        />
      }
    >
      <div className="overflow-x-auto">
        <div className="w-full p-5 h-screen">
          <Typography.Title level={2} className="text-black dark:text-white">
            Productions
          </Typography.Title>
          <div className="flex flex-wrap items-center justify-between pb-2">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <Input
                placeholder="Filter by product type or level..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-8 w-[270px]"
              />
            </div>

            <div className="flex items-center py-2 justify-between overflow-y-auto">
              <Tooltip title="Add new production">
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                  <AlertDialogTrigger asChild>
                    <Button className="h-8">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Production
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-h-[550px] overflow-auto">
                    <AlertDialogTitle>Add a new production</AlertDialogTitle>
                    <AlertDialogDescription>
                      Click submit when you&apos;re done.
                    </AlertDialogDescription>
                    <AddProduction
                      onProductionAdded={handleProductionAdded}
                      setIsOpen={setIsOpen}
                    />
                  </AlertDialogContent>
                </AlertDialog>
              </Tooltip>
              <PrintableForm />
            </div>
          </div>
          <Tabs defaultValue="table">
            <TabsList className="grid w-[300px] grid-cols-2">
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="graph">Graph</TabsTrigger>
            </TabsList>
            <TabsContent value="table" className="mt-4">
              <div className="rounded-md border">
                <CustomTable columns={columns} data={data} loading={loading} />
              </div>
            </TabsContent>
            <TabsContent value="graph" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Left Card */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Productions</CardTitle>
                    <CardDescription>
                      A graph showing the production quantity of each product
                      type for the current year and the previous year.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ProductionChart />
                  </CardContent>
                </Card>

                {/* Right Cards Container */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                  {/* Additional Card 1 */}
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle className="text-md">
                        Quantity Produced
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      {/* Content for the first additional card */}
                    </CardContent>
                  </Card>

                  {/* Additional Card 2 */}
                  <Card className="flex-1">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-md">Performance</CardTitle>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost">
                              <Maximize2Icon className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[550px] overflow-auto">
                            <DialogTitle>Performance</DialogTitle>
                            <DialogDescription>
                              A graph showing the performance of the production
                              department.
                            </DialogDescription>
                            <ProductionPerformance />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ProductionPerformance />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Spin>
  );
};

export default Productions;
