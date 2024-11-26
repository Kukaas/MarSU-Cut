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
import { Spin } from "antd";
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
import CustomPageTitle from "@/components/components/custom-components/CustomPageTitle";
import EditOrderItems from "@/components/components/forms/EditOrderItmes";

function Orders() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogClaimed, setDialogClaimed] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

      setLoadingUpdate(false);
      if (error.response && error.response.status === 400) {
        ToasterError({
          description: error.response.data.message,
        });
      } else if (error.response && error.response.status === 404) {
        ToasterError({
          description: error.response.data.message,
        });
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleReject = (order) => updateOrderStatus(order, "REJECTED");
  const handleApprove = (order) => updateOrderStatus(order, "APPROVED");
  const handleDone = (order) => updateOrderStatus(order, "DONE");
  const handleClaimed = async (order) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/order/update/student/claimed/${order._id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success(`Order of ${order.studentName} is claimed successfully!`);
        setData((prevData) =>
          prevData.map((item) =>
            item._id === order._id ? { ...item, status: "CLAIMED" } : item
          )
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

  const handleEditOrderItems = (order) => {
    setSelectedOrder(order);
    setIsEditDialogOpen(true);
  };

  const updateOrderData = (updatedOrder) => {
    setData((prevData) =>
      prevData.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

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
                Down Payment
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
          // Check for full payment receipt
          const fullPaymentReceipt = receipts.find(
            (receipt) => receipt.type === "Full Payment"
          );

          if (fullPaymentReceipt) {
            if (fullPaymentReceipt.isVerified) {
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
                    Paid - Verified
                  </p>
                </div>
              );
            } else {
              return (
                <div className="status-badge">
                  <div
                    className="size-2 rounded-full"
                    style={{ backgroundColor: "#FFAB00" }}
                  />
                  <p
                    className="text-[12px] font-semibold"
                    style={{ color: "#FFAB00" }}
                  >
                    Paid - Not Verified
                  </p>
                </div>
              );
            }
          }
        }

        // If balance is not zero, show current balance
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
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/dashboard?tab=order-details`, {
                    state: { selectedOrder: order },
                  });
                }}
              >
                View Order Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEditOrderItems(order)}
                disabled={[
                  "REJECTED",
                  "MEASURED",
                  "DONE",
                  "CLAIMED",
                  "PENDING",
                  "APPROVED",
                ].includes(order.status)}
              >
                Edit Items
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
                  disabled={[
                    "REJECTED",
                    "DONE",
                    "CLAIMED",
                    "PENDING",
                    "APPROVED",
                  ].includes(order.status)}
                >
                  Finished
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setDialogClaimed(true);
                    setSelectedOrder(order);
                  }}
                  disabled={[
                    "REJECTED",
                    "PENDING",
                    "APPROVED",
                    "CLAIMED",
                  ].includes(order.status)}
                >
                  Claimed
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
        <CustomPageTitle
          title="Orders"
          description={<span>Total Orders: {data.length}</span>}
        />
        <DataTableToolBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleStatusChange={handleStatusChange}
          statusFilter={statusFilter}
          navigate={() => navigate("/dashboard?tab=archive-orders")}
          status={status}
          placeholder="Filter by student number or name"
          title="Go to Archive Orders"
          name="Archive"
        />
        <div className="rounded-md border">
          <CustomTable columns={columns} data={data} loading={loading} />
        </div>
      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-h-[550px] max-w-[550px] overflow-auto">
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

      {/* Claimed confirmation dialog */}
      <AlertDialog open={dialogClaimed} onOpenChange={setDialogClaimed}>
        <AlertDialogContent className="sm:max-w-[450px] max-h-[350px] overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-center">
              Confirm Claimed
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center mt-2">
              Are you sure you this order is claimed? Once confirmed, the order
              status will be marked as claimed, and further actions may not be
              reversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-6 flex justify-between w-full gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setDialogClaimed(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleClaimed(selectedOrder);
                setDialogClaimed(false);
              }}
              className="w-full"
              type="submit"
            >
              Confirm
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <AlertDialogContent className="max-h-[550px] max-w-[550px] overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Order Items</AlertDialogTitle>
            <AlertDialogDescription>
              Update the order items below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <EditOrderItems
            selectedOrder={selectedOrder}
            setIsDialogOpen={setIsEditDialogOpen}
            onOrderUpdated={updateOrderData}
          />
        </AlertDialogContent>
      </AlertDialog>
    </Spin>
  );
}

export default Orders;
