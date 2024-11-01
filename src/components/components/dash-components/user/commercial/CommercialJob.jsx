import { Spin, Tooltip, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import CreateCommercialOrder from "@/components/components/forms/CreateCommercialOrder";
import { toast } from "sonner";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import ToasterError from "@/lib/Toaster";
import CustomTable from "@/components/components/custom-components/CustomTable";
import { statusColors } from "@/lib/utils";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CommercialJobDetails from "../../admin/tables/details/CommercialJobDetails";

const CommercialJob = () => {
  const [data, setData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchCommercialJob = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/commercial-job/${currentUser._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
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

  const handleDelete = async (commercial) => {
    try {
      setLoadingDelete(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/commercial-job/${commercial._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        const updatedData = data.filter((item) => item._id !== commercial._id);
        setData(updatedData);
        setLoadingDelete(false);
        toast.success(
          `Commercial job with ID ${commercial._id} has been deleted.`
        );
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    }
  };

  const columns = [
    {
      accessorKey: "cbName",
      header: "Name",
    },
    {
      accessorKey: "cbEmail",
      header: "Email",
    },
    {
      accessorKey: "contactNumber",
      header: "Contact",
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
        const commercial = row.original;

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
                  setSelectedOrder(commercial);
                  setDetailsDialogOpen(true);
                }}
              >
                Show Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(commercial)}
                disabled={["APPROVED", "MEASURED", "DONE", "CLAIMED"].includes(
                  commercial.status
                )}
              >
                <span className="text-red-500 hover:text-red-400">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleCreateCommercialOrder = (newCommercialOrder) => {
    setData((prevData) => [...prevData, newCommercialOrder]);
  };

  return (
    <Spin
      spinning={loadingDelete}
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
          Commercial Job Orders
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
                  <AlertDialogTitle>
                    Create a commercial job order
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Click submit when you&apos;re done.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <CreateCommercialOrder
                  onCommercialOrderCreated={handleCreateCommercialOrder}
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
      <AlertDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <CommercialJobDetails selectedOrder={selectedOrder} />
      </AlertDialog>
    </Spin>
  );
};

export default CommercialJob;
