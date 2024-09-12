import CustomTable from "@/components/components/custom-components/CustomTable";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import CreateOrder from "@/components/components/forms/CreateOrder";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BASE_URL } from "@/lib/api";
import ToasterError from "@/lib/Toaster";
import { token } from "@/lib/token";
import { statusColors } from "@/lib/utils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Spin, Tooltip, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function Orders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleViewReceipts = (order) => {
    navigate(`/orders/receipts/${order}`);
  };

  // Fetch the data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/order/student/${currentUser._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setData(res.data.orders);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser._id]);

  // Function to handle delete
  const handleDelete = async (order) => {
    try {
      setLoadingDelete(true);
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
        setLoadingDelete(false);
        toast.success(`The order with ID ${order._id} has been deleted.`);

        // Update the data in the state
        setData((prevData) => {
          return prevData.filter((item) => item._id !== order._id);
        });
      } else {
        setLoadingDelete(false);
        ToasterError();
      }
    } catch (error) {
      setLoadingDelete(false);
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    }
  };

  const addNewOrder = (newOrder) => {
    setData((prevData) => [newOrder, ...prevData]);
    setIsDialogOpen(false);
  };

  const handleClaimed = (order) => updateOrderStatus(order, "CLAIMED");

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
        return `Php${totalPrice.toFixed(2)}`; // Format as currency
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
              <DropdownMenuItem
                onClick={() => handleClaimed(order)}
                disabled={order.status === "CLAIMED" || order.status !== "DONE"}
              >
                Claimed
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(order)}
                disabled={["APPROVED", "MEASURED", "DONE", "CLAIMED"].includes(
                  order.status
                )}
              >
                <span className="text-red-400">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <Spin
      spinning={loadingDelete || loadingUpdate}
      indicator={
        <LoadingOutlined
          className="dark:text-white"
          style={{
            fontSize: 48,
          }}
          x
        />
      }
    >
      <div className="w-full p-5 h-screen">
        <Typography.Title level={2} className="text-black dark:text-white">
          Orders
        </Typography.Title>
        <div className="flex items-center py-4 justify-end">
          <Tooltip title="Create an Order">
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="default" className="m-2 h-8">
                  <PlusCircle size={20} className="mr-2 h-4 w-4" />
                  Create
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Create an order</AlertDialogTitle>
                  <AlertDialogDescription>
                    Click submit when you&apos;re done.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <CreateOrder
                  addNewOrder={addNewOrder}
                  setIsDialogOpen={setIsDialogOpen}
                />
              </AlertDialogContent>
            </AlertDialog>
          </Tooltip>
        </div>
        <div className="rounded-md border">
          <CustomTable columns={columns} data={data} loading={loading} />
        </div>
      </div>
    </Spin>
  );
}

export default Orders;
