import AddNewProduct from "@/components/components/forms/AddNewProduct";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Tooltip } from "antd";
import { ChevronDownIcon, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import EditProduct from "@/components/components/forms/EditProduct";
import { toast } from "sonner";

const FinishedProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchFinishedProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://marsu.cut.server.kukaas.tech/api/v1/finished-product/all"
      );

      const data = res.data;
      setData(data.finishedProducts);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinishedProduct();
  }, []);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res = await axios.delete(
        `https://marsu.cut.server.kukaas.tech/api/v1/finished-product/delete/${selectedProduct._id}`
      );

      if (res.status === 200) {
        setDeleteLoading(false);
        setOpenDeleteDialog(false);
        setData((prevData) =>
          prevData.filter((product) => product._id !== selectedProduct._id)
        );
        toast.success("Product deleted successfully!", {
          action: {
            label: "Ok",
          },
        });
      }
    } catch (error) {
      toast.error("Uh oh! Something went wrong");
      setOpenDeleteDialog(false);
      setDeleteLoading(false);
      console.error(error);
    }
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "level",
      header: "Level",
    },
    {
      accessorKey: "productType",
      header: "Product Type",
    },
    {
      accessorKey: "size",
      header: "Size",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        let bgColor, textColor;

        switch (status) {
          case "In Stock":
            bgColor = "bg-green-500";
            textColor = "text-white";
            break;
          case "Out of Stock":
            bgColor = "bg-red-500";
            textColor = "text-white";
            break;
          default:
            bgColor = "bg-gray-500";
            textColor = "text-white";
            break;
        }

        return (
          <div
            className={`capitalize ${bgColor} ${textColor} p-2 rounded-lg flex items-center justify-center h-full`}
          >
            {status}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center justify-center space-x-2">
            <Tooltip title="Edit product">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                      Please fill out the form below to edit product.
                    </DialogDescription>
                  </DialogHeader>
                  <EditProduct selectedProduct={selectedProduct} />
                </DialogContent>
              </Dialog>
            </Tooltip>
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
                      setSelectedProduct(product);
                      setOpenDeleteDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Product</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this product?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center justify-end gap-2">
                    <DialogClose>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={(event) => handleDelete(event)}
                    >
                      {deleteLoading ? (
                        <span className="loading-dots">Deleting</span>
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
      <div className="w-full p-4 h-screen">
        <div className="flex items-center py-4 justify-between">
          <Input
            placeholder="Filter by product type..."
            value={table.getColumn("productType")?.getFilterValue() || ""}
            onChange={(event) =>
              table.getColumn("productType")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Tooltip title="Add new product">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="m-2">
                  <PlusCircle size={20} className="mr-2" />
                  New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add a new product</DialogTitle>
                  <DialogDescription>
                    Click submit when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <AddNewProduct />
              </DialogContent>
            </Dialog>
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Please fill out the form below to add new product.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinishedProduct;
