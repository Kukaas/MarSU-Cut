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
import { toast } from "sonner";
import { Spin } from "antd";

// icons
import { LoadingOutlined } from "@ant-design/icons";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

// others
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ToasterError from "@/lib/Toaster";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/custom-components/CustomTable";
import { statusColors } from "@/lib/utils";
import CustomBadge from "@/components/components/custom-components/CustomBadge";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import DataTableToolBar from "@/components/components/custom-components/DataTableToolBar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MeasureMentForm from "@/components/components/forms/MeasureMentForm";
import CommercialJobDetails from "./details/CommercialJobDetails";
import CustomPageTitle from "@/components/components/custom-components/CustomPageTitle";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const CommercialJob = () => {
  const [data, setData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [orderToReject, setOrderToReject] = useState(null);
  const [loadingReject, setLoadingReject] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommercialJob = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/commercial-job/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const commercialOrders = res.data.commercialOrders.filter(
          (order) => !order.isArchived
        );
        setOriginalData(commercialOrders);
        setData(commercialOrders);

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCommercialJob();
  }, [currentUser]);

  useEffect(() => {
    if (searchValue) {
      const filteredData = originalData.filter((order) =>
        order.cbName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setData(filteredData);
    } else {
      setData(originalData);
    }
  }, [searchValue, originalData]);

  const handleUpdateStatus = async (commercial, status) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/commercial-job/update/${commercial._id}`,
        {
          status,
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
        const updatedData = data.map((item) =>
          item._id === commercial._id ? { ...item, status } : item
        );
        setData(updatedData);
        toast.success(
          `Commercial job order of ${
            commercial.cbName
          } has been ${status.toLowerCase()}.`
        );
      } else {
        ToasterError();
      }
    } catch (error) {
      console.error(error);
      ToasterError({
        description: "Please check you internet connection and try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleApprove = (commercial) =>
    handleUpdateStatus(commercial, "APPROVED");
  const handleDone = (commercial) => handleUpdateStatus(commercial, "DONE");
  const handleClaimed = (commercial) =>
    handleUpdateStatus(commercial, "CLAIMED");

  const handleReject = async (order) => {
    setOrderToReject(order);
    setIsRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setLoadingReject(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/commercial-job/update/${orderToReject._id}`,
        { status: "REJECTED", reason: rejectReason },
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
          `Order of ${orderToReject.studentName} is rejected successfully!`
        );
        setData((prevData) =>
          prevData.map((item) =>
            item._id === orderToReject._id
              ? { ...item, status: "REJECTED" }
              : item
          )
        );
        setIsRejectDialogOpen(false);
        setRejectReason("");
      } else {
        toast.error("Failed to reject order");
      }
    } catch (error) {
      console.error("Error rejecting order:", error);
      toast.error("An error occurred while rejecting the order");
    } finally {
      setLoadingReject(false);
    }
  };

  const handleArchive = async (commercial) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/commercial-job/archive/${commercial._id}`,
        {
          isArchived: true,
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
        const updatedData = data.filter((item) => item._id !== commercial._id);
        setData(updatedData);
        setLoadingUpdate(false);
        toast.success(
          `Commercial job order of ${commercial.cbName} has been archived.`
        );
      } else {
        ToasterError({
          description: "Please check you internet connection and try again.",
        });
      }
    } catch (error) {
      ToasterError({
        description: "Please check you internet connection and try again.",
      });
    }
  };

  const columns = [
    {
      accessorKey: "cbName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "cbEmail",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: "contactNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact" />
      ),
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
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    handleReject(commercial);
                  }}
                  disabled={[
                    "REJECTED",
                    "APPROVED",
                    "MEASURED",
                    "DONE",
                    "CLAIMED",
                  ].includes(commercial.status)}
                >
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleApprove(commercial)}
                  disabled={[
                    "APPROVED",
                    "MEASURED",
                    "DONE",
                    "CLAIMED",
                  ].includes(commercial.status)}
                >
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsDialogOpen(true);
                    setSelectedOrder(commercial);
                  }}
                  disabled={[
                    "REJECTED",
                    "PENDING",
                    "MEASURED",
                    "DONE",
                    "CLAIMED",
                  ].includes(commercial.status)}
                >
                  Measure
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    handleDone(commercial);
                    setSelectedOrder(commercial);
                  }}
                  disabled={["REJECTED", "PENDING", "DONE", "CLAIMED"].includes(
                    commercial.status
                  )}
                >
                  Done
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    handleClaimed(commercial);
                    setSelectedOrder(commercial);
                  }}
                  disabled={["REJECTED", "PENDING", "CLAIMED"].includes(
                    commercial.status
                  )}
                >
                  Claimed
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleArchive(commercial)}>
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    if (status === "All") {
      setData(originalData); // Assuming originalData is the unfiltered data
    } else {
      setData(originalData.filter((order) => order.status === status));
    }
  };

  const status = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    MEASURED: "MEASURED",
    DONE: "DONE",
    CLAIMED: "CLAIMED",
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
          title="Commercial Job Orders"
          description={<span>Total Commercial Job Orders: {data.length}</span>}
        />
        <DataTableToolBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleStatusChange={handleStatusChange}
          statusFilter={statusFilter}
          navigate={() => navigate("/dashboard?tab=archive-commercial-job")}
          status={status}
          placeholder="Filter by name..."
          title="Go to Archive Commercial Job Orders"
          name="Archive"
        />
        <div className="rounded-md border">
          <CustomTable columns={columns} data={data} loading={loading} />
        </div>
      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="h-[500px] overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Record Measurement</AlertDialogTitle>
            <AlertDialogDescription>
              Please fill out the form below to add measurements
            </AlertDialogDescription>
          </AlertDialogHeader>
          <MeasureMentForm
            selectedOrder={selectedOrder}
            setIsDialogOpen={setIsDialogOpen}
          />
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <CommercialJobDetails selectedOrder={selectedOrder} />
      </AlertDialog>

      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Order</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter reason for rejection"
          />
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmReject} disabled={loadingReject}>
              {loadingReject ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 animate-spin" />
                  <span>Rejecting</span>
                </div>
              ) : (
                "Reject"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Spin>
  );
};

export default CommercialJob;
