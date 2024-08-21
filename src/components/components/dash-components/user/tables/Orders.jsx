import { useState, useEffect } from "react";
import axios from "axios";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { LoadingOutlined } from "@ant-design/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spin, Tooltip, Typography } from "antd";
import { PlusCircle } from "lucide-react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateOrder from "../../../forms/CreateOrder";
import { toast } from "sonner";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import ToasterError from "@/lib/Toaster";
import CustomTable from "@/components/components/CustomTable";

function Orders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [table, setTable] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

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
        // Check if orderItems is not present or is an empty array
        if (!row.original.orderItems || row.original.orderItems.length === 0) {
          return <div>Not yet Measured</div>;
        }

        // Group items by productType, size, and level, and sum their quantities
        const groupedItems = row.original.orderItems.reduce((acc, item) => {
          const key = `${item.productType}-${item.size}-${item.level}`;
          if (!acc[key]) {
            acc[key] = { ...item, quantity: 0 }; // Initialize if not exist
          }
          acc[key].quantity += item.quantity; // Sum the quantity
          return acc;
        }, {});

        // Convert the grouped items object back to an array for rendering
        const itemsToRender = Object.values(groupedItems);

        return (
          <div>
            {itemsToRender.map((item, index) => (
              <div key={index}>
                <span className="font-bold">{item.level}</span>:{" "}
                <span className="font-semibold">{item.productType}</span> -{" "}
                <span className="font-semibold">{item.size}</span> -{" "}
                <span className="font-semibold">{item.quantity}</span>
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
      accessorKey: "status",
      header: () => <span className="font-bold">Status</span>,
      cell: ({ row }) => {
        const statusStyles = {
          APPROVED: {
            color: "blue",
            badgeText: "Approved",
          },
          MEASURED: {
            color: "#c09000",
            badgeText: "Measured",
          },
          DONE: {
            color: "blue",
            badgeText: "Done",
          },
          CLAIMED: {
            color: "#31a900",
            badgeText: "Claimed",
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
        <Typography.Title level={2} className="text-black dark:text-white">
          Orders
        </Typography.Title>
        <div className="flex items-center py-4 justify-between">
          <Input
            placeholder="Filter Student Numbers..."
            value={table?.getColumn("studentNumber")?.getFilterValue() || ""}
            onChange={(event) => {
              if (table) {
                table
                  .getColumn("studentNumber")
                  ?.setFilterValue(event.target.value);
              }
            }}
            className="max-w-sm"
          />
          <Tooltip title="Create an Order">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="m-2">
                  <PlusCircle size={20} className="mr-2" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create an order</DialogTitle>
                  <DialogDescription>
                    Click submit when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <CreateOrder addNewOrder={addNewOrder} />
              </DialogContent>
            </Dialog>
          </Tooltip>
        </div>
        <div className="rounded-md border">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : (
            <CustomTable
              columns={columns}
              data={data}
              onTableInstance={setTable}
            />
          )}
        </div>
      </div>
    </Spin>
  );
}

export default Orders;
