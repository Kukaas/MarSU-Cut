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
import { Spin, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { ArchiveIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

function Rentals() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReturned, setLoadingReturned] = useState(false);
  const [loadingArchive, setLoadingArchive] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const toastError = () => {
    toast.error(
      "Uh oh! Something went wrong.")
  };

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://garments.kukaas.tech/api/v1/rental/all/get`
      );

      const activeRentals = res.data.rentals.filter(
        (rental) => !rental.isArchived
      );

      const rentalsWithPenalties = await Promise.all(
        activeRentals.map(async (rental) => {
          const penaltyRes = await axios.get(
            `https://garments.kukaas.tech/api/v1/rental/penalty/${rental._id}`
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

  // Update the status of the rental to approved
  const handleApprove = async (rental) => {
    try {
      setLoadingApprove(true);
      const res = await axios.put(
        `https://garments.kukaas.tech/api/v1/rental/update/${rental._id}`,
        { status: "APPROVED" }
      );

      if (res.status === 200) {
        setLoadingApprove(false);
        toast.success(`Rental of ${rental.studentName} is approved successfully!`)

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

  // Update the status of the rental to returned
  const handleReturn = async (rental) => {
    try {
      setLoadingReturned(true);
      const res = await axios.put(
        `https://garments.kukaas.tech/api/v1/rental/return/${rental._id}`
      );

      if (res.status === 200) {
        setLoadingReturned(false);
        toast.success(`Rental of ${rental.studentName} is returned!`)

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
        setLoadingReturned(false);
      }
    } catch (error) {
      toastError();
      setLoadingReturned(false);
    }
  };

  // Archive the rental
  const handleArchive = async (rental) => {
    try {
      setLoadingArchive(true);
      const res = await axios.put(
        `https://garments.kukaas.tech/api/v1/rental/archive/update/${rental._id}`,
        {
          isArchived: true,
        }
      );

      if (res.status === 200) {
        setLoadingArchive(false);
        toast.success(`Rental of ${rental.studentName} is archived successfully!`)

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
  const handleDelete = async (rental) => {
    try {
      const res = await axios.delete(
        `https://garments.kukaas.tech/api/v1/rental/${rental._id}`
      );

      if (res.status === 200) {
        toast.success(`Rental of ${rental.studentName} is deleted successfully!`)
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
      accessorKey: "studentNumber",
      header: "Student Number",
    },
    {
      accessorKey: "studentName",
      header: "Student Name",
    },
    {
      accessorKey: "receipt",
      header: "Receipt",
      cell: ({ row }) => (
        <a
          href={row.getValue("receipt")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={row.getValue("receipt")}
            alt="Receipt"
            style={{ width: "50px", height: "50px" }}
          />
        </a>
      ),
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
      header: "Status",
      key: "status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        let bgColor, textColor;

        switch (status) {
          case "APPROVED":
            bgColor = "bg-blue-300 bg-opacity-50";
            textColor = "text-black";
            break;
          case "RETURNED":
            bgColor = "bg-green-300 bg-opacity-50";
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
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleApprove(rental)}>
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReturn(rental)}>
                  Returned
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleArchive(rental)}>
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(rental)}>
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
    },
  });

  const rowsPerPage = 5;

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(
        prevPage + 1,
        Math.floor(table.getRowModel().rows.length / rowsPerPage)
      )
    );
  };

  const displayedRows = table
    .getRowModel()
    .rows.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  return (
    <Spin
      spinning={loadingApprove || loadingReturned || loadingArchive}
      indicator={
        <LoadingOutlined className="dark:text-white" style={{ fontSize: 48 }} />
      }
    >
      <div className="w-full p-4 h-screen">
        <div className="flex items-center py-4 justify-between">
          <Input
            placeholder="Filter Student Numbers..."
            value={table.getColumn("studentNumber")?.getFilterValue() || ""}
            onChange={(event) =>
              table
                .getColumn("studentNumber")
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
                {displayedRows.length ? (
                  displayedRows.map((row) => (
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
              disabled={
                (currentPage + 1) * rowsPerPage >=
                table.getRowModel().rows.length
              }
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
