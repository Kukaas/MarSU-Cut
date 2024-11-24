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
import CustomTable from "@/components/components/custom-components/CustomTable";
import { statusColors } from "@/lib/utils";
import CustomBadge from "@/components/components/custom-components/CustomBadge";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import CustomPageTitle from "@/components/components/custom-components/CustomPageTitle";

function ArchiveOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleViewReceipts = (order) => {
    navigate(`/orders/receipts/${order}`);
  };

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

  //       // Update the data in the state
  //       setData((prevData) => {
  //         return prevData.filter((item) => item._id !== order._id);
  //       });
  //     } else {
  //       setLoadingUpdate(false);
  //       ToasterError();
  //     }
  //   } catch (error) {
  //     setLoadingUpdate(false);
  //     ToasterError({
  //       description: "Please check you internet connection and try again.",
  //     });
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
        <DataTableColumnHeader column={column} title="Schedules " />
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
              <DropdownMenuItem onClick={() => handleUnarchive(order)}>
                Unarchive
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
          title="Archived Orders"
          description="List of all archived orders"
        />
        <div className="flex flex-wrap items-center justify-between pb-2">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Input
              placeholder="Filter by student number or name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-8 w-[270px]"
            />
          </div>
          <Tooltip title="Back to Orders">
            <Button
              variant="default"
              className="m-2 h-8"
              onClick={() => navigate("/dashboard?tab=orders-admin")}
            >
              <ArrowDownLeft size={20} className="mr-2 h-4 w-4" />
              Orders
            </Button>
          </Tooltip>
        </div>
        <div className="rounded-md border">
          <CustomTable columns={columns} data={data} loading={loading} />
        </div>
      </div>
    </Spin>
  );
}

export default ArchiveOrders;
