// UI
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, Typography } from "antd";
import { toast } from "sonner";

import { Loader2, PlusCircle } from "lucide-react";

// others
import ToasterError from "@/lib/Toaster";
import axios from "axios";
import { useEffect, useState } from "react";

import AddProduction from "@/components/components/forms/AddProduction";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/CustomTable";

const Productions = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [table, setTable] = useState(null);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 771);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductions();
  }, []);

  const handleDelete = async (event) => {
    event.preventDefault();
    setDeleteLoading(true);

    try {
      const res = await axios.delete(
        `${BASE_URL}/api/v1/production/delete/${selectedProduction._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success(`Production with ID ${selectedProduction._id} deleted.`);

        setData((prevData) => {
          return prevData.filter(
            (production) => production._id !== selectedProduction._id
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
      header: "Product Type",
    },
    {
      accessorKey: "size",
      header: "Size",
    },
    {
      accessorKey: "level",
      header: "Level",
    },
    {
      accessorKey: "productionDateFrom",
      header: "Production Date From",
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
      header: "Production Date To",
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
      header: "Actions",
      cell: ({ row }) => {
        const production = row.original;
        return (
          <div className="flex space-x-2">
            <Tooltip title="Delete product">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedProduction(production);
                    }}
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Raw Material</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this raw material?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center justify-end gap-2">
                    <DialogClose>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={(event) => handleDelete(event)}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 animate-spin" />
                          <span>Deleting</span>
                        </div>
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="w-full p-5 h-screen">
        <Typography.Title level={2} className="text-black dark:text-white">
          Productions
        </Typography.Title>
        <div className="flex items-center py-4 justify-between gap-2">
          <Input
            placeholder="Filter by product type..."
            value={table?.getColumn("productType")?.getFilterValue() || ""}
            onChange={(event) => {
              if (table) {
                table
                  .getColumn("studentNumber")
                  ?.setFilterValue(event.target.value);
              }
            }}
            className="max-w-sm"
          />
          <Tooltip title="Add new production">
            {!isSmallScreen ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Production
                  </Button>
                </SheetTrigger>
                <SheetContent className="max-h-screen overflow-auto">
                  <Tabs defaultValue="uniform" className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="uniform">Uniform</TabsTrigger>
                      <TabsTrigger value="academicGown">
                        Academic Gown
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="uniform" className="mt-4">
                      <SheetTitle>Add a new uniform production</SheetTitle>
                      <SheetDescription>
                        Click submit when you&apos;re done.
                      </SheetDescription>
                      <AddProduction />
                    </TabsContent>
                    <TabsContent value="academicGown" className="mt-4">
                      <SheetTitle>
                        Add a new academic gown production
                      </SheetTitle>
                      <SheetDescription>
                        Click submit when you&apos;re done.
                      </SheetDescription>
                    </TabsContent>
                  </Tabs>
                </SheetContent>
              </Sheet>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Production
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[550px] overflow-auto">
                  <Tabs defaultValue="uniform" className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="uniform">Uniform</TabsTrigger>
                      <TabsTrigger value="academicGown">
                        Academic Gown
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="uniform" className="mt-4">
                      <DialogTitle>Add a new uniform production</DialogTitle>
                      <DialogDescription>
                        Click submit when you&apos;re done.
                      </DialogDescription>
                      <AddProduction />
                    </TabsContent>
                    <TabsContent value="academicGown" className="mt-4">
                      <DialogTitle>
                        Add a new academic gown production
                      </DialogTitle>
                      <DialogDescription>
                        Click submit when you&apos;re done.
                      </DialogDescription>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}
          </Tooltip>
        </div>
        <div className="rounded-md border">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : (
            <CustomTable
              columns={columns}
              data={data}
              onTableInstance={setTable}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Productions;
