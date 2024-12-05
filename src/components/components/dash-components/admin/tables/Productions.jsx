// UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "antd";

import { PlusCircle } from "lucide-react";

// others
import axios from "axios";
import { useEffect, useState } from "react";
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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PrintableForm from "@/hooks/PrintableForm";
import CustomPageTitle from "@/components/components/custom-components/CustomPageTitle";
import ProductionYear from "../production-components/ProductionYear";
import ProductionMonth from "../production-components/ProductionMonth";
import { useSelector } from "react-redux";
import AddProductionUniform from "@/components/components/forms/AddProductionUniform";
import AcademicTable from "../production-components/AcademicTable";
import AddProductionAcademic from "@/components/components/forms/AddProductionAcademic";
import OtherProductionTable from "../production-components/OtherProductionTable";
import CreateOtherProduction from "@/components/components/forms/CreateOtherProduction";

const Productions = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("monthly");
  const { currentUser } = useSelector((state) => state.user);
  const [selectedForm, setSelectedForm] = useState(null);

  const renderForm = () => {
    switch (selectedForm) {
      case "schoolUniform":
        return (
          <div>
            <AddProductionUniform
              onProductionAdded={handleProductionAdded}
              setIsOpen={setIsOpen}
            />
          </div>
        );
      case "academicGown":
        return (
          <div>
            <AddProductionAcademic
              onAcademicAdded={handleProductionAdded}
              setIsDialogOpen={setIsOpen}
            />
          </div>
        );
      case "others":
        return (
          <div>
            <CreateOtherProduction
              onOtherProductionAdded={handleProductionAdded}
              setIsDialogOpen={setIsOpen}
            />
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-4">
            <Button onClick={() => setSelectedForm("schoolUniform")}>
              School Uniform
            </Button>
            <Button onClick={() => setSelectedForm("academicGown")}>
              Academic Gown
            </Button>
            <Button onClick={() => setSelectedForm("others")}>Others</Button>
          </div>
        );
    }
  };

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
                {currentUser.role === "JO" && currentUser.isAdmin && (
                  <AlertDialogTrigger asChild>
                    <Button className="h-8">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Production
                    </Button>
                  </AlertDialogTrigger>
                )}
                <AlertDialogContent className="max-h-[550px] overflow-auto">
                  <AlertDialogTitle>
                    {selectedForm ? "Fill the Form" : "Select Production Type"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {selectedForm
                      ? `Please fill out the form below to add ${selectedForm}.`
                      : "Select the type of production you want to add."}
                  </AlertDialogDescription>
                  {renderForm()}
                  <AlertDialogFooter className="w-full flex justify-between">
                    <Button
                      className="w-full"
                      onClick={() => setSelectedForm(null)}
                      variant="secondary"
                    >
                      Back
                    </Button>
                    <AlertDialogCancel className="w-full">
                      Cancel
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Tooltip>
            <PrintableForm />
          </div>
        </div>
        <Tabs defaultValue="schoolUniform">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="schoolUniform">School Uniform</TabsTrigger>
            <TabsTrigger value="academicGown">Academic Gown</TabsTrigger>
            <TabsTrigger value="others">Others</TabsTrigger>
            <TabsTrigger value="graph">Graph</TabsTrigger>
          </TabsList>
          <TabsContent value="schoolUniform" className="mt-4">
            <div className="rounded-md border">
              <CustomTable columns={columns} data={data} loading={loading} />
            </div>
          </TabsContent>
          <TabsContent value="academicGown" className="mt-4">
            <AcademicTable />
          </TabsContent>
          <TabsContent value="others" className="mt-4">
            <OtherProductionTable />
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
