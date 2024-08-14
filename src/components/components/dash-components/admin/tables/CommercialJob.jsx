import { Tooltip, Typography } from "antd";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArchiveIcon, ChevronDownIcon, Loader2 } from "lucide-react";
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
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CommercialJob = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommercialJob = async () => {
      try {
        const res = await axios.get(
          `https://marsu.cut.server.kukaas.tech/api/v1/commercial-job/all`
        );
        const data = res.data;
        if (res.status === 200) {
          setData(data.commercialOrders);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCommercialJob();
  }, [currentUser]);

  const handleApprove = async (commercial, event) => {
    event.preventDefault();
    try {
      setLoadingApprove(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/commercial-job/update/${commercial._id}`,
        {
          status: "APPROVED",
        }
      );

      if (res.status === 200) {
        setDropdownOpen(false);
        setLoadingApprove(false);
        const updatedData = data.map((item) =>
          item._id === commercial._id ? { ...item, status: "APPROVED" } : item
        );
        setData(updatedData);
        toast.success(
          `Commercial job with ID ${commercial._id} has been approved.`,
          {
            action: {
              label: "Ok",
            },
          }
        );
      }
    } catch (error) {
      setLoadingApprove(false);
      toast.error("Uh oh! Something went wrong", {
        action: {
          label: "Ok",
        },
      });
    }
  };

  const handleDelete = async (commercial, event) => {
    event.preventDefault();
    try {
      setLoadingDelete(true);
      const res = await axios.delete(
        `https://marsu.cut.server.kukaas.tech/api/v1/commercial-job/${commercial._id}`
      );

      if (res.status === 200) {
        setDropdownOpen(false);
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
      header: () => <span className="font-bold">Status</span>,
      cell: ({ row }) => {
        const statusStyles = {
          APPROVED: {
            color: "blue",
            badgeText: "Approved",
          },
          PENDING: {
            color: "red",
            badgeText: "Pending",
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const commercial = row.original;

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
                onClick={() => navigator.clipboard.writeText(commercial._id)}
              >
                Copy Commercial Job ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(event) => handleApprove(commercial, event)}
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
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(event) => handleDelete(commercial, event)}
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
          Commercial Job Orders
        </Typography.Title>
        <div className="flex items-center py-4 justify-between">
          <Input
            placeholder="Search by name..."
            value={table.getColumn("cbName")?.getFilterValue() || ""}
            onChange={(event) =>
              table.getColumn("cbName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Tooltip title="Archive Commercial Job Orders">
            <Button
              variant="default"
              className="m-2"
              onClick={() => navigate("/dashboard?tab=archive-commercial-job")}
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
};

export default CommercialJob;
