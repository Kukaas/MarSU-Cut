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
import { Spin, Tooltip } from "antd";
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
import AddNewReceipt from "@/components/components/forms/AddNewReceipt";
import CustomPageTitle from "@/components/components/custom-components/CustomPageTitle";

function Orders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openReceiptForm, setOpenReceiptForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleViewReceipts = (order) => {
    navigate(`/orders/receipts/${order._id}`, {
      state: {
        selectedOrder: order, // Pass the selected order here
      },
    });
  };

  const setNewCurrentBalance = (order) => {
    const totalPrice = order.orderItems.reduce(
      (acc, item) => acc + parseFloat(item.totalPrice || 0),
      0
    );

    const receipts = order.receipts || [];
    const totalAmountPaid = receipts.reduce(
      (acc, receipt) => acc + parseFloat(receipt.amount || 0),
      0
    );

    const currentBalance = totalPrice - totalAmountPaid;

    setCurrentBalance(currentBalance);
  };

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

  // Fetch the data
  useEffect(() => {
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

  const addNewReceipt = () => {
    setOpenReceiptForm(false);
    fetchData();
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
        return `₱${totalPrice.toFixed(2)}`; // Format as currency
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

        return (
          <div className="status-badge">
            <div
              className="size-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <p className="text-[12px] font-semibold" style={{ color }}>
              {status === "DONE" ? "For Claiming" : badgeText}
            </p>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;

        // Calculate the currentBalance here
        const totalPrice = order.orderItems.reduce(
          (acc, item) => acc + parseFloat(item.totalPrice || 0),
          0
        );

        const receipts = order.receipts || [];
        const totalAmountPaid = receipts.reduce(
          (acc, receipt) => acc + parseFloat(receipt.amount || 0),
          0
        );

        const currentBalance = totalPrice - totalAmountPaid;

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
              {currentUser.role === "Student" && (
                <DropdownMenuItem
                  onClick={() => {
                    if (currentBalance > 0 && order.status !== "APPROVED") {
                      setSelectedOrder(order);
                      setNewCurrentBalance(order);
                      setOpenReceiptForm(true);
                    }
                  }}
                  disabled={currentBalance === 0 || order.status === "APPROVED"}
                >
                  Add New Receipt
                </DropdownMenuItem>
              )}

              <DropdownMenuItem onClick={() => handleViewReceipts(order)}>
                View Receipts
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/dashboard?tab=order-details`, {
                    state: {
                      selectedOrder: order,
                    },
                  });
                }}
              >
                View Order Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
      spinning={loadingDelete}
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
        <CustomPageTitle
          title="Orders"
          description="View and manage your orders"
        />
        <div className="flex items-center py-4 justify-end">
          <Tooltip title="Create an Appointment">
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="default" className="m-2 h-8">
                  <PlusCircle size={20} className="mr-2 h-4 w-4" />
                  Create
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[450px] max-h-[550px] overflow-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>Create an Appointment</AlertDialogTitle>
                  <AlertDialogDescription>
                    Fill in the form below to create a new order.
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
      <AlertDialog open={openReceiptForm} onOpenChange={setOpenReceiptForm}>
        <AddNewReceipt
          selectedOrder={selectedOrder}
          currentBalance={currentBalance}
          addNewReceipt={addNewReceipt}
        />
      </AlertDialog>
    </Spin>
  );
}

export default Orders;
