import AddProduction from "@/components/components/forms/AddProduction";
import { Button } from "@/components/ui/button";
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/lib/Toaster";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Tooltip, Typography } from "antd";
import axios from "axios";
import { ChevronDownIcon, Loader2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Productions = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

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
        const res = await axios.get(
          "https://marsu.cut.server.kukaas.tech/api/v1/production/all"
        );

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
        `https://marsu.cut.server.kukaas.tech/api/v1/production/delete/${selectedProduction._id}`
      );

      if (res.status === 200) {
        setOpenDeleteDialog(false);
        toast.success(`Produxtion with ID ${selectedProduction._id} deleted.`, {
          
        });

        setData((prevData) => {
          return prevData.filter(
            (production) => production._id !== selectedProduction._id
          );
        });
      }
    } catch (error) {
      Toaster();
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
              <Dialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedProduction(production);
                      setOpenDeleteDialog(true);
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

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage,
        pageSize: 5,
      },
    },
  });

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => {
      const maxPage = table.getPageCount() - 1;
      return Math.min(prevPage + 1, maxPage);
    });
  };

  return (
    <div className="overflow-x-auto">
      <div className="w-full p-5 h-screen">
        <Typography.Title level={2} className="text-black dark:text-white">
          Productions
        </Typography.Title>
        <div className="flex items-center py-4 justify-between gap-2">
          <Input
            placeholder="Filter by product type..."
            value={table.getColumn("productType")?.getFilterValue() || ""}
            onChange={(event) =>
              table.getColumn("productType")?.setFilterValue(event.target.value)
            }
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= table.getPageCount() - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productions;
