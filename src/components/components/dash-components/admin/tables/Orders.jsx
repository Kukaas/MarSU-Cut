// UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spin, Tooltip, Typography } from "antd";
import { toast } from "sonner";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { LoadingOutlined } from "@ant-design/icons";

// others
import { useNavigate } from "react-router-dom";
import { ArchiveIcon } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import ToasterError from "@/lib/Toaster";

import AddOrderItems from "../../../forms/AddOrderItems";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "../../../CustomTable";
import StatusFilter from "@/components/components/StatusFilter";
import { statusColors } from "@/lib/utils";
import CustomBadge from "@/components/components/CustomBadge";

function Orders() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/v1/order/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setLoading(false);
        const orders = response.data.orders.filter(
          (order) => !order.isArchived
        );
        setOriginalData(orders);
        setData(orders);
      } catch (error) {
        setLoading(false);
        setData([]);
        ToasterError();
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (searchValue) {
      const lowercasedSearchValue = searchValue.toLowerCase();

      const filteredData = originalData.filter((orders) => {
        return (
          orders.studentName.toLowerCase().includes(lowercasedSearchValue) ||
          orders.studentNumber.toLowerCase().includes(lowercasedSearchValue)
        );
      });

      setData(filteredData);
    } else {
      setData(originalData);
    }
  }, [searchValue, originalData]);

  const updateOrderStatus = async (order, status) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/order/update/student/${order._id}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success(
          `Order of ${
            order.studentName
          } is ${status.toLowerCase()} successfully!`
        );
        setData((prevData) =>
          prevData.map((item) =>
            item._id === order._id
              ? { ...item, status, schedule: res.data.schedule }
              : item
          )
        );
      } else {
        ToasterError();
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleReject = (order) => updateOrderStatus(order, "REJECTED");
  const handleApprove = (order) => updateOrderStatus(order, "APPROVED");
  const handleDone = (order) => updateOrderStatus(order, "DONE");
  const handleClaimed = (order) => updateOrderStatus(order, "CLAIMED");

  const handleArchive = async (order) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/order/archive/update/${order._id}`,
        { isArchived: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success(
          `Order of ${order.studentName} is archived successfully!`
        );
        setData((prevData) =>
          prevData.filter((item) => item._id !== order._id)
        );
      } else {
        ToasterError();
      }
    } catch (error) {
      setLoadingUpdate(false);
      ToasterError({
        description: "Please check you internet connection and try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (order) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/order/student/delete/${order._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setLoadingUpdate(false);
        toast.success(`Order of ${order.studentName} is deleted successfully!`);
        setData((prevData) =>
          prevData.filter((item) => item._id !== order._id)
        );
      } else {
        ToasterError();
      }
    } catch (error) {
      ToasterError({
        description: "Please check you internet connection and try again.",
      });
      setLoadingUpdate(false);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const columns = [
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
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={row.getValue("receipt")}
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
                  <div className="flex flex-row gap-2">
                    <span className="font-semibold text-xs">
                      {item.productType}
                    </span>{" "}
                    -{" "}
                    <span className="font-semibold text-xs">
                      {item.quantity}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-row ">
                    <span className="font-bold text-xs">{item.level}:</span>{" "}
                    <span className="font-semibold text-xs">
                      {item.productType}
                    </span>{" "}
                    - <span className="font-semibold text-xs">{item.size}</span>{" "}
                    -{" "}
                    <span className="font-semibold text-xs">
                      {item.quantity}
                    </span>
                  </div>
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
        return `₱${totalPrice.toFixed(2)}`;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const { color, badgeText } =
          statusColors[status] || statusColors.default;

        return <CustomBadge color={color} badgeText={badgeText} />;
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
                onClick={() => {
                  navigate(`/dashboard?tab=order-details`, {
                    state: { selectedOrder: order },
                  });
                }}
              >
                View Order Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleReject(order)}
                  disabled={[
                    "REJECTED",
                    "APPROVED",
                    "MEASURED",
                    "DONE",
                    "CLAIMED",
                  ].includes(order.status)}
                >
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleApprove(order)}
                  disabled={[
                    "REJECTED",
                    "APPROVED",
                    "MEASURED",
                    "DONE",
                    "CLAIMED",
                  ].includes(order.status)}
                >
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsDialogOpen(true);
                    setSelectedOrder(order);
                  }}
                  disabled={order.status === "REJECTED"}
                >
                  Measure
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDone(order)}
                  disabled={order.status === "REJECTED"}
                >
                  Done
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleClaimed(order)}
                  disabled={order.status === "REJECTED"}
                >
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

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setData(
      status === "All"
        ? originalData
        : originalData.filter((order) => order.status === status)
    );
  };

  const status = {
    REJECTED: "REJECTED",
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    MEASURED: "MEASURED",
    DONE: "DONE",
    CLAIMED: "CLAIMED",
  };

  const handleAddOrderItems = (order) => {
    setData((prevData) =>
      prevData.map((item) =>
        item._id === order._id
          ? { ...item, status: "MEASURED", orderItems: order.orderItems }
          : item
      )
    );
  };

  return (
    <Spin
      spinning={loadingUpdate}
      indicator={
        <LoadingOutlined
          className="dark:text-white"
          style={{
            fontSize: 48,
          }}
        />
      }
    >
      <div className="w-full p-5 h-screen">
        <Typography.Title level={2} className="text-black dark:text-white">
          Orders
        </Typography.Title>
        <div className="flex items-center py-4 justify-between">
          <div className="flex items-center w-[450px]">
            <Input
              placeholder="Search student number or name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full"
            />
            <StatusFilter
              status={status}
              handleStatusChange={handleStatusChange}
              statusFilter={statusFilter}
            />
          </div>
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
        </div>
        <div className="rounded-md border">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : (
            <CustomTable columns={columns} data={data} />
          )}
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="overflow-auto">
          <DialogHeader>
            <DialogTitle>Add Order Items</DialogTitle>
            <DialogDescription>
              Please fill out the form below to add items to your order.
            </DialogDescription>
          </DialogHeader>
          <AddOrderItems
            selectedOrder={selectedOrder}
            setIsDialogOpen={setIsDialogOpen}
            onOrderItemsAdded={handleAddOrderItems}
          />
        </DialogContent>
      </Dialog>
    </Spin>
  );
}

export default Orders;
