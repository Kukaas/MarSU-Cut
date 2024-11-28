// UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "antd";
// import { toast } from "sonner";

import { PlusCircle } from "lucide-react";
// import { LoadingOutlined } from "@ant-design/icons";

// others
// import ToasterError from "@/lib/Toaster";
import axios from "axios";
import { useEffect, useState } from "react";

import AddProduction from "@/components/components/forms/AddProduction";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/custom-components/CustomTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
// import DeleteDialog from "@/components/components/custom-components/DeleteDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PrintableForm from "@/hooks/PrintableForm";
import CustomPageTitle from "@/components/components/custom-components/CustomPageTitle";
import ProductionYear from "../production-components/ProductionYear";
import ProductionMonth from "../production-components/ProductionMonth";
import { useSelector } from "react-redux";

const Productions = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("monthly");
  const { currentUser } = useSelector((state) => state.user);

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
  ];

  const handleProductionAdded = (newProduction) => {
    setData((prevData) => [...prevData, newProduction]);
  };

  return (
    <div className="overflow-x-auto">
      <div className="w-full p-5 h-screen">
        <CustomPageTitle
          title="Productions"
          description="View and manage productions"
        />
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
                {currentUser.role === "Admin" && currentUser.isAdmin && (
                  <AlertDialogTrigger asChild>
                    <Button className="h-8">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Production
                    </Button>
                  </AlertDialogTrigger>
                )}
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
          <TabsContent value="graph" className="mt-4 p-5">
            <Card>
              <CardContent>
                <div className="w-full">
                  <Tabs defaultValue="monthly" className="mt-5 flex flex-col">
                    <div className="flex flex-col mb-4 lg:flex-row lg:justify-between md:flex-row md:justify-between">
                      <div className="flex flex-col gap-3 mt-3">
                        {tab === "monthly" ? (
                          <div>
                            <CardTitle>Monthly Production Summary</CardTitle>
                            <CardDescription>
                              View a summary of your monthly production
                            </CardDescription>
                          </div>
                        ) : (
                          <div>
                            <CardTitle>Yearly Production Summary</CardTitle>
                            <CardDescription>
                              View a summary of your yearly production
                            </CardDescription>
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <TabsList>
                          <TabsTrigger
                            value="monthly"
                            onClick={() => setTab("monthly")}
                          >
                            Monthly
                          </TabsTrigger>
                          <TabsTrigger
                            value="yearly"
                            onClick={() => setTab("yearly")}
                          >
                            Yearly
                          </TabsTrigger>
                        </TabsList>
                      </div>
                    </div>
                    <TabsContent value="monthly">
                      <ProductionMonth />
                    </TabsContent>
                    <TabsContent value="yearly">
                      <ProductionYear />
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Productions;
