import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { LoadingOutlined } from "@ant-design/icons";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Spin, Tooltip, Typography } from "antd";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import CreateRental from "../../../forms/CreateRental";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { token } from "@/lib/token";
import ToasterError from "@/lib/Toaster";
import { BASE_URL } from "@/lib/api";

function Rentals() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  // Fetch the data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/v1/rental/${currentUser._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Fetch the penalties for each rental
      const rentalsWithPenalties = await Promise.all(
        res.data.rental.map(async (rental) => {
          const penaltyRes = await axios.get(
            `${BASE_URL}/api/v1/rental/penalty/${rental._id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          return { ...rental, penalty: penaltyRes.data.penalty };
        })
      );

      setLoading(false);
      setData(rentalsWithPenalties);
    };

    fetchData();
  }, [currentUser._id]);

  // Function to handle delete
  const handleDelete = async (rental) => {
    try {
      setLoadingDelete(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/rental/${rental._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setLoadingDelete(false);
        toast.success(`Rental whith rental ID ${rental._id} has been deleted!`);

        // Update the data in the state
        setData((prevData) => {
          return prevData.filter((item) => item._id !== rental._id);
        });
      } else {
        ToasterError();
        setLoadingDelete(false);
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
      setLoadingDelete(false);
    }
  };

  const columns = [
    {
      accessorKey: "idNumber",
      header: "ID Number",
    },
    {
      accessorKey: "coordinatorName",
      header: "Coordinator Name",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "rentalDate",
      header: "Rental Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("rentalDate"));
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "returnDate",
      header: "ReturnDate",
      key: "returnDate",
      cell: ({ row }) => {
        const date = new Date(row.getValue("returnDate"));
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "status",
      header: () => <span className="font-bold">Status</span>,
      cell: ({ row }) => {
        const statusStyles = {
          APPROVED: {
            color: "blue",
            badgeText: "Approved",
          },
          REJECTED: {
            color: "red",
            badgeText: "Rejected",
          },
          GIVEN: {
            color: "#c09000",
            badgeText: "Given",
          },
          PENDING: {
            color: "red",
            badgeText: "Pending",
          },
          RETURNED: {
            color: "#31a900",
            badgeText: "Returned",
          },
          default: {
            color: "pink",
            badgeText: "Unknown",
          },
        };

        const status = row.getValue("status");
        const { color, badgeText } =
          statusStyles[status] || statusStyles.default;

        return (
          <div className="status-badge">
            <div
              className="size-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <p className="text-[12px] font-semibold" style={{ color }}>
              {badgeText}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "penalty",
      header: "Penalty",
      render: (penalty) => `₱${penalty}`,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rental = row.original;

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
                onClick={() => navigator.clipboard.writeText(rental._id)}
              >
                Copy Rental ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(rental)}
                disabled={["APPROVED", "GIVEN", "RETURNED"].includes(
                  rental.status
                )}
              >
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
        <LoadingOutlined className="dark:text-white" style={{ fontSize: 48 }} />
      }
    >
      <div className="w-full p-5 h-screen">
        <Typography.Title level={2} className="text-black dark:text-white">
          Rentals
        </Typography.Title>
        <div className="flex items-center py-4 justify-between">
          <Input
            placeholder="Filter Student Numbers..."
            value={table.getColumn("coordinatorName")?.getFilterValue() || ""}
            onChange={(event) =>
              table
                .getColumn("coordinatorName")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Tooltip title="Create Rentals">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="m-2">
                  <PlusCircle size={20} className="mr-2" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create a Rental</DialogTitle>
                  <DialogDescription>
                    Click submit when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <CreateRental />
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
}

export default Rentals;
