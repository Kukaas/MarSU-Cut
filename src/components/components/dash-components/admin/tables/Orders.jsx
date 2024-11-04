// UI
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
import { Spin, Typography } from "antd";
import { toast } from "sonner";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { LoadingOutlined } from "@ant-design/icons";

// others
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ToasterError from "@/lib/Toaster";

import AddOrderItems from "../../../forms/AddOrderItems";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "../../../custom-components/CustomTable";
import { statusColors } from "@/lib/utils";
import CustomBadge from "@/components/components/custom-components/CustomBadge";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import DataTableToolBar from "@/components/components/custom-components/DataTableToolBar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

  const handleViewReceipts = (order) => {
    navigate(`/orders/receipts/${order}`);
  };

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

  // const handleDelete = async (order) => {
  //   try {
  //     setLoadingUpdate(true);
  //     const res = await axios.delete(
  //       `${BASE_URL}/api/v1/order/student/delete/${order._id}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         withCredentials: true,
  //       }
  //     );

  //     if (res.status === 200) {
  //       setLoadingUpdate(false);
  //       toast.success(`Order of ${order.studentName} is deleted successfully!`);
  //       setData((prevData) =>
  //         prevData.filter((item) => item._id !== order._id)
  //       );
  //     } else {
  //       ToasterError();
  //     }
  //   } catch (error) {
  //     ToasterError({
  //       description: "Please check you internet connection and try again.",
  //     });
  //     setLoadingUpdate(false);
  //   } finally {
  //     setLoadingUpdate(false);
  //   }
  // };

  const columns = [
    {
      accessorKey: "studentNumber",
      header: "Student Number",
    },
    {
      accessorKey: "studentName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "studentGender",
      header: "Gender",
    },
    {
      accessorKey: "schedule",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Schedules" />
      ),
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
      accessorKey: "currentBalance",
      header: "Current Balance",
      cell: ({ row }) => {
        const orderItems = row.original.orderItems || [];
        const totalPrice = orderItems.reduce(
          (acc, item) => acc + parseFloat(item.totalPrice || 0),
          0
        );

        if (!totalPrice) {
          return (
            <div className="status-badge">
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: "gray" }}
              />
              <p
                className="text-[12px] font-semibold"
                style={{ color: "gray" }}
              >
                Down
              </p>
            </div>
          );
        }

        const receipts = row.original.receipts || [];
        const totalAmountPaid = receipts.reduce(
          (acc, receipt) => acc + parseFloat(receipt.amount || 0),
          0
        );

        const currentBalance = totalPrice - totalAmountPaid;

        if (currentBalance === 0) {
          return (
            <div className="status-badge">
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: "#32C75F" }}
              />
              <p
                className="text-[12px] font-semibold"
                style={{ color: "#32C75F" }}
              >
                Paid
              </p>
            </div>
          );
        }
        return `₱${currentBalance.toFixed(2)}`;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        const { color, badgeText } =
          statusColors[status] || statusColors.default;

        return <CustomBadge color={color} badgeText={badgeText} />;
      },
    },
    {
      id: "actions",
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
              <DropdownMenuItem onClick={() => handleViewReceipts(order._id)}>
                View Receipts
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
                  disabled={[
                    "REJECTED",
                    "MEASURED",
                    "DONE",
                    "CLAIMED",
                    "PENDING",
                  ].includes(order.status)}
                >
                  Measure
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDone(order)}
                  disabled={["REJECTED", "DONE", "CLAIMED", "PENDING"].includes(
                    order.status
                  )}
                >
                  Done
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleArchive(order)}>
                Archive
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => handleDelete(order)}>
                <span className="text-red-500 hover:text-red-400">Delete</span>
              </DropdownMenuItem> */}
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
        <DataTableToolBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleStatusChange={handleStatusChange}
          statusFilter={statusFilter}
          navigate={() => navigate("/dashboard?tab=archive-orders")}
          status={status}
          placeholder="Filter by student number or name"
        />
        <div className="rounded-md border">
          <CustomTable columns={columns} data={data} loading={loading} />
        </div>
      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Add Order Items</AlertDialogTitle>
            <AlertDialogDescription>
              Please fill out the form below to add items to your order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AddOrderItems
            selectedOrder={selectedOrder}
            setIsDialogOpen={setIsDialogOpen}
            onOrderItemsAdded={handleAddOrderItems}
          />
        </AlertDialogContent>
      </AlertDialog>
    </Spin>
  );
}

export default Orders;
