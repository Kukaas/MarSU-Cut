import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
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
  DropdownMenuGroup,
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
import { Tooltip, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { ArchiveIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

function Rentals() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [loadingArchive, setLoadingArchive] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingGiven, setLoadingGiven] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toastError = () => {
    toast.error("Uh oh! Something went wrong.");
  };

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://marsu.cut.server.kukaas.tech/api/v1/rental/all/get`
      );

      const activeRentals = res.data.rentals.filter(
        (rental) => !rental.isArchived
      );

      const rentalsWithPenalties = await Promise.all(
        activeRentals.map(async (rental) => {
          const penaltyRes = await axios.get(
            `https://marsu.cut.server.kukaas.tech/api/v1/rental/penalty/${rental._id}`
          );
          return { ...rental, penalty: penaltyRes.data.penalty };
        })
      );
      setData(rentalsWithPenalties);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleReject = async (rental, event) => {
    event.preventDefault();
    try {
      setLoadingReject(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/rental/update/${rental._id}`,
        { status: "REJECTED" }
      );

      if (res.status === 200) {
        setDropdownOpen(false);
        setLoadingReject(false);
        toast.success(
          `Rental of ${rental.coordinatorName} is rejected successfully!`,
          {
            action: {
              label: "Ok",
            },
          }
        );

        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === rental._id) {
              return { ...item, status: "REJECTED" };
            }

            return item;
          });
        });
      } else {
        toastError();
        setLoadingReject(false);
      }
    } catch (error) {
      toastError();
      setLoadingReject(false);
    }
  };

  // Update the status of the rental to approved
  const handleApprove = async (rental, event) => {
    event.preventDefault();
    try {
      setLoadingApprove(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/rental/update/${rental._id}`,
        { status: "APPROVED" }
      );

      if (res.status === 200) {
        setDropdownOpen(false);
        setLoadingApprove(false);
        toast.success(
          `Rental of ${rental.coordinatorName} is approved successfully!`,
          {
            action: {
              label: "Ok",
            },
          }
        );

        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === rental._id) {
              return { ...item, status: "APPROVED" };
            }

            return item;
          });
        });
      } else {
        toastError();
        setLoadingApprove(false);
      }
    } catch (error) {
      toastError();
      setLoadingApprove(false);
    }
  };

  const handleGiven = async (rental, event) => {
    event.preventDefault();
    try {
      setLoadingGiven(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/rental/update/${rental._id}`,
        {
          status: "GIVEN",
        }
      );

      if (res.status === 200) {
        setDropdownOpen(false);
        setLoadingGiven(false);
        toast.success(`Rental of ${rental.coordnatorName} is given!`, {
          action: {
            label: "Ok",
          },
        });

        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === rental._id) {
              return { ...item, status: "GIVEN" }; // Correct status update
            }
            return item;
          });
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message); // Correct error handling
      } else {
        toast.error("An unexpected error occurred."); // Handle other errors
      }
      setLoadingGiven(false);
    }
  };

  // Update the status of the rental to returned
  const handleReturn = async (rental, event) => {
    event.preventDefault();
    try {
      setLoadingReturn(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/rental/update/${rental._id}`,
        {
          status: "RETURNED",
        }
      );

      if (res.status === 200) {
        setDropdownOpen(false);
        setLoadingReturn(false);
        toast.success(`Rental of ${rental.coordinatorName} is returned!`, {
          action: {
            label: "Ok",
          },
        });

        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === rental._id) {
              return { ...item, status: "RETURNED" };
            }

            return item;
          });
        });
      } else {
        toastError();
        setLoadingReturn(false);
      }
    } catch (error) {
      toastError();
      setLoadingReturn(false);
    }
  };

  // Archive the rental
  const handleArchive = async (rental, event) => {
    event.preventDefault();
    try {
      setLoadingArchive(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/rental/archive/update/${rental._id}`,
        {
          isArchived: true,
        }
      );

      if (res.status === 200) {
        setDropdownOpen(false);
        setLoadingArchive(false);
        toast.success(
          `Rental of ${rental.coordinatorName} is archived successfully!`,
          {
            action: {
              label: "Ok",
            },
          }
        );

        setData((prevData) => {
          return prevData.filter((item) => item._id !== rental._id);
        });
      } else {
        toastError();
        setLoadingArchive(false);
      }
    } catch (error) {
      {
        toastError();
        setLoadingArchive(false);
      }
    }
  };

  // Delete the rental
  const handleDelete = async (rental, event) => {
    event.preventDefault();
    try {
      setLoadingDelete(true);
      const res = await axios.delete(
        `https://marsu.cut.server.kukaas.tech/api/v1/rental/${rental._id}`
      );

      if (res.status === 200) {
        setLoadingDelete(false);
        setDropdownOpen(false);
        toast.success(
          `Rental of ${rental.coordinatorName} is deleted successfully!`,
          {
            action: {
              label: "Ok",
            },
          }
        );
        // Update the data in the state
        setData((prevData) => {
          return prevData.filter((item) => item._id !== rental._id);
        });
      } else {
        toastError();
      }
    } catch (error) {
      toastError();
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
            color: "gray",
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
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(event) => handleReject(rental, event)}
                  disabled={loadingReject}
                >
                  {loadingReject ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 animate-spin h-4 w-4" />
                      <span>Rejecting</span>
                    </div>
                  ) : (
                    "Reject"
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(event) => handleApprove(rental, event)}
                  disabled={loadingApprove}
                >
                  {loadingApprove ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 animate-spin h-4 w-4" />
                      <span>Approving</span>
                    </div>
                  ) : (
                    "Approve"
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(event) => handleGiven(rental, event)}
                  disabled={loadingGiven}
                >
                  {loadingGiven ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 animate-spin h-4 w-4" />
                      <span>Given</span>
                    </div>
                  ) : (
                    "Given"
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(event) => handleReturn(rental, event)}
                  disabled={loadingReturn}
                >
                  {loadingReturn ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 animate-spin h-4 w-4" />
                      <span>Returned</span>
                    </div>
                  ) : (
                    "Returned"
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(event) => handleArchive(rental, event)}
                disabled={loadingArchive}
              >
                {loadingArchive ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 animate-spin h-4 w-4" />
                    <span>Archiving</span>
                  </div>
                ) : (
                  "Archive"
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(event) => handleDelete(rental, event)}
                disabled={loadingDelete}
              >
                {loadingDelete ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 animate-spin h-4 w-4" />
                    <span className="text-red-500 hover:text-red-400">
                      Deleting
                    </span>
                  </div>
                ) : (
                  <span className="text-red-500 hover:text-red-400">
                    Delete
                  </span>
                )}
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
    <div>
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
          <Tooltip title="Archive Rentals">
            <Button
              variant="default"
              className="m-2"
              onClick={() => navigate("/dashboard?tab=archive-rentals")}
            >
              <ArchiveIcon size={20} className="mr-2" />
              Archive
            </Button>
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
}

export default Rentals;
