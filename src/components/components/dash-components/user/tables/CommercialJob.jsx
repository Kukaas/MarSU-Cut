import { Spin, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Checkbox } from "@/components/ui/checkbox";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import CreateCommercialOrder from "@/components/components/forms/CreateCommercialOrder";
import { toast } from "sonner";

const CommercialJob = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchCommercialJob = async () => {
      try {
        const res = await axios.get(
          `https://marsu.cut.server.kukaas.tech/api/v1/commercial-job/${currentUser._id}`
        );
        const data = res.data;
        if (res.status === 200) {
          setData(data.orders);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCommercialJob();
  }, [currentUser]);

  const handleDelete = async (commercial) => {
    try {
      setLoadingDelete(true);
      const res = await axios.delete(
        `https://marsu.cut.server.kukaas.tech/api/v1/commercial-job/${commercial._id}`
      );

      if (res.status === 200) {
        const updatedData = data.filter((item) => item._id !== commercial._id);
        setData(updatedData);
        setLoadingDelete(false);
        toast.success(
          `Commercial job with ID ${commercial._id} has been deleted.`,
          {
            action: {
              label: "Ok",
            },
          }
        );
      }
    } catch (error) {
      toast.error("Uh oh! Something went wrong", {
        action: {
          label: "Ok",
        },
      });
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
      accessorKey: "idNumber",
      header: "ID Number",
    },
    {
      accessorKey: "cbName",
      header: "Name",
    },
    {
      accessorKey: "cbEmail",
      header: "Email",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        let bgColor, textColor;

        switch (status) {
          case "APPROVED":
            bgColor = "bg-blue-300 bg-opacity-50";
            textColor = "text-black";
            break;
          case "DONE":
            bgColor = "bg-purple-300 bg-opacity-50";
            textColor = "text-black";
            break;
          default:
            bgColor = "bg-pink-300 bg-opacity-50";
            textColor = "text-black";
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
        const commercial = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(commercial._id)}
              >
                Copy Commercial Job ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(commercial)}>
                <span className="text-red-500 hover:text-red-400">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
    <Spin
      spinning={loadingDelete}
      indicator={
        <LoadingOutlined
          className="dark:text-white"
          style={{
            fontSize: 48,
          }}
        />
      }
    >
      <div className="w-full p-4 h-screen">
        <div className="flex items-center py-4 justify-between">
          <Input
            placeholder="Filter Student Numbers..."
            value={table.getColumn("idNumber")?.getFilterValue() || ""}
            onChange={(event) =>
              table.getColumn("idNumber")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Tooltip title="Create an Order">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="m-2">
                  <PlusCircle size={20} className="mr-2" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create an commercial job order</DialogTitle>
                  <DialogDescription>
                    Click submit when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <CreateCommercialOrder />
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
    </Spin>
  );
};

export default CommercialJob;