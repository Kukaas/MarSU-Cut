// UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spin, Tooltip, Typography } from "antd";

// icons
import { LoadingOutlined } from "@ant-design/icons";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ArrowDownLeft } from "lucide-react";

// others
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ToasterError from "@/lib/Toaster";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/CustomTable";

function ArchiveOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArchivedOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/api/v1/order/archive/all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setData(response.data.orders);
        setOriginalData(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedOrders();
  }, []);

  useEffect(() => {
    // Apply search filter
    const filteredData = originalData.filter((order) =>
      order.studentNumber.toLowerCase().includes(searchValue.toLowerCase())
    );
    setData(filteredData);
  }, [searchValue, originalData]);

  // Unarchive orders
  const handleUnarchive = async (order) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/order/archive/update/${order._id}`,
        {
          isArchived: false,
        },
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
        toast.success(
          `Order of ${order.studentName} is unarchived successfully!`
        );

        setData((prevData) => {
          return prevData.filter((item) => item._id !== order._id);
        });
      } else {
        ToasterError();
        setLoadingUpdate(false);
      }
    } catch (error) {
      ToasterError({
        description: "Please check you internet connection and try again.",
      });
      setLoadingUpdate(false);
    }
  };

  // Function to handle delete
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

        // Update the data in the state
        setData((prevData) => {
          return prevData.filter((item) => item._id !== order._id);
        });
      } else {
        setLoadingUpdate(false);
        ToasterError();
      }
    } catch (error) {
      setLoadingUpdate(false);
      ToasterError({
        description: "Please check you internet connection and try again.",
      });
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusStyles = {
          APPROVED: {
            color: "#2b4cbe",
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
                onClick={() => {
                  navigator.clipboard.writeText(order._id);
                }}
              >
                Copy Order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleUnarchive(order)}>
                Unarchive
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
          Archive Orders
        </Typography.Title>
        <div className="flex items-center py-4 justify-between">
          <div className="flex items-center w-[300px]">
            <Input
              placeholder="Search by student number"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Tooltip title="Back to Orders">
            <Button
              variant="default"
              className="m-2"
              onClick={() => navigate("/dashboard?tab=orders-admin")}
            >
              <ArrowDownLeft size={20} className="mr-2" />
              Orders
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
    </Spin>
  );
}

export default ArchiveOrders;
