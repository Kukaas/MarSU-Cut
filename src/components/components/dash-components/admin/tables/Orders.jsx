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
import { Checkbox } from "@/components/ui/checkbox";
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
import { Spin, Tooltip, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { ArchiveIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddOrderItems from "../../../forms/AddOrderItems";

function Orders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [loadingClaimed, setLoadingClaimed] = useState(false);
  const [loadingArchive, setLoadingArchive] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const toastError = () => {
    toast.error("Uh oh! Something went wrong.", {
      action: { label: "Ok" },
    });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://marsu.cut.server.kukaas.tech/api/v1/order/all"
        );
        setLoading(false);
        setData(response.data.orders.filter((order) => !order.isArchived));
      } catch (error) {
        setLoading(false);
        setData([]);
        toastError();
      }
    };
    fetchOrders();
  }, []);

  const handleApprove = async (order) => {
    try {
      setLoadingApprove(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/order/update/student/${order._id}`,
        { status: "APPROVED" }
      );

      if (res.status === 200) {
        toast.success(
          `Order of ${order.studentName} is approved successfully!`,
          { action: { label: "Ok" } }
        );
        setData((prevData) =>
          prevData.map((item) =>
            item._id === order._id
              ? { ...item, status: "APPROVED", schedule: res.data.schedule }
              : item
          )
        );
      } else {
        toastError();
      }
    } catch (error) {
      toastError();
    } finally {
      setLoadingApprove(false);
    }
  };

  const handleDone = async (order) => {
    try {
      setLoadingDone(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/order/update/student/${order._id}`,
        { status: "DONE" }
      );

      if (res.status === 200) {
        toast.success(`Order of ${order.studentName} is ready to be claimed!`, {
          action: { label: "Ok" },
        });
        setData((prevData) =>
          prevData.map((item) =>
            item._id === order._id ? { ...item, status: "DONE" } : item
          )
        );
      } else {
        toastError();
      }
    } catch (error) {
      toastError();
    } finally {
      setLoadingDone(false);
    }
  };

  const handleClaimed = async (order) => {
    try {
      setLoadingClaimed(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/order/update/student/${order._id}`,
        { status: "CLAIMED" }
      );

      if (res.status === 200) {
        toast.success(`Order of ${order.studentName} is claimed!`, {
          action: { label: "Ok" },
        });
        setData((prevData) =>
          prevData.map((item) =>
            item._id === order._id ? { ...item, status: "CLAIMED" } : item
          )
        );
      } else {
        toastError();
      }
    } catch (error) {
      toastError();
    } finally {
      setLoadingClaimed(false);
    }
  };

  const handleArchive = async (order) => {
    try {
      setLoadingArchive(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/order/archive/update/${order._id}`,
        { isArchived: true }
      );

      if (res.status === 200) {
        toast.success(
          `Order of ${order.studentName} is archived successfully!`,
          { action: { label: "Ok" } }
        );
        setData((prevData) =>
          prevData.filter((item) => item._id !== order._id)
        );
      } else {
        toastError();
      }
    } catch (error) {
      toastError();
    } finally {
      setLoadingArchive(false);
    }
  };

  const handleDelete = async (order) => {
    try {
      setLoadingDelete(true);
      const res = await axios.delete(
        `https://marsu.cut.server.kukaas.tech/api/v1/order/student/delete/${order._id}`
      );

      if (res.status === 200) {
        toast.success(
          `Order of ${order.studentName} is deleted successfully!`,
          { action: { label: "Ok" } }
        );
        setData((prevData) =>
          prevData.filter((item) => item._id !== order._id)
        );
      } else {
        toastError();
      }
    } catch (error) {
      toastError();
    } finally {
      setLoadingDelete(false);
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
      accessorKey: "studentGender",
      header: "Gender",
    },
    {
      accessorKey: "receipt",
      header: "Receipt",
      cell: ({ row }) => (
        <a target="_blank" rel="noopener noreferrer">
          <img
            src={row.getValue("receipt")}
            alt="Receipt"
            style={{ width: "50px", height: "50px" }}
          />
        </a>
      ),
    },
    {
      accessorKey: "schedule",
      header: "Schedule",
      cell: ({ row }) => {
        const scheduleValue = row.getValue("schedule");
        if (!scheduleValue) {
          return "Not scheduled yet";
        }
        const date = new Date(scheduleValue);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "orderItems",
      header: "Order Items",
      cell: ({ row }) => {
        const orderItems = row.original.orderItems || [];

        if (!Array.isArray(orderItems) || orderItems.length === 0) {
          return <div>Not yet Measured</div>;
        }

        const groupedItems = orderItems.reduce((acc, item) => {
          const key = `${item.productType}-${item.size}-${item.level}`;
          if (!acc[key]) {
            acc[key] = { ...item, quantity: 0 };
          }
          acc[key].quantity += item.quantity;
          return acc;
        }, {});

        const itemsToRender = Object.values(groupedItems);

        return (
          <div>
            {itemsToRender.map((item, index) => (
              <div key={index}>
                {item.productType === "LOGO" ||
                item.productType === "NECKTIE" ? (
                  <>
                    <span className="font-semibold">{item.productType}</span> -{" "}
                    <span className="font-semibold">{item.quantity}</span>
                  </>
                ) : (
                  <>
                    <span className="font-bold">{item.level}</span>:{" "}
                    <span className="font-semibold">{item.productType}</span> -{" "}
                    <span className="font-semibold">{item.size}</span> -{" "}
                    <span className="font-semibold">{item.quantity}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
      cell: ({ row }) => {
        const totalPrice = row.original.orderItems.reduce(
          (acc, item) => acc + parseFloat(item.totalPrice || 0),
          0
        );
        return `Php${totalPrice.toFixed(2)}`;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        let bgColor, textColor;

        switch (status) {
          case "APPROVED":
            bgColor = "bg-blue-300";
            textColor = "text-white";
            break;
          case "MEASURED":
            bgColor = "bg-orange-300";
            textColor = "text-white";
            break;
          case "DONE":
            bgColor = "bg-purple-300";
            textColor = "text-white";
            break;
          case "CLAIMED":
            bgColor = "bg-green-300";
            textColor = "text-white";
            break;
          default:
            bgColor = "bg-pink-300";
            textColor = "text-white";
        }

        return (
          <div
            className={`capitalize ${bgColor} ${textColor} p-2 rounded-lg flex items-center justify-center h-full font-semibold`}
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
        const order = row.original;

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
                onClick={() => navigator.clipboard.writeText(order._id)}
              >
                Copy Order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleApprove(order)}>
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsDialogOpen(true);
                    setSelectedOrder(order);
                  }}
                >
                  Measure
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDone(order)}>
                  Done
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleClaimed(order)}>
                  Claimed
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleArchive(order)}>
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(order)}>
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
      spinning={
        loadingApprove ||
        loadingClaimed ||
        loadingDone ||
        loadingArchive ||
        loadingDelete
      }
      indicator={
        <LoadingOutlined className="dark:text-white" style={{ fontSize: 48 }} />
      }
    >
      <div className="w-full p-5 h-screen">
        <Typography.Title level={2} className="text-black dark:text-white">
          Orders
        </Typography.Title>
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
          <Tooltip title="Archive Orders">
            <Button
              variant="default"
              className="m-2"
              onClick={() => navigate("/dashboard?tab=archive-orders")}
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Order Items</DialogTitle>
            <DialogDescription>
              Please fill out the form below to add items to your order.
            </DialogDescription>
          </DialogHeader>
          <AddOrderItems selectedOrder={selectedOrder} />
        </DialogContent>
      </Dialog>
    </Spin>
  );
}

export default Orders;
