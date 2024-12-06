// UI
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { AlertDialog } from "@/components/ui/alert-dialog";
import CommercialJobDetails from "./details/CommercialJobDetails";
import CustomPageTitle from "@/components/components/custom-components/CustomPageTitle";

const ArchiveCommercialJob = () => {
  const [data, setData] = useState([]);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/commercial-job/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const commercialOrders = res.data.commercialOrders.filter(
          (order) => order.isArchived
        );
        setOriginalData(commercialOrders);
        setData(commercialOrders);

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchArchive();
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

  const handleUnarchive = async (commercial) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/commercial-job/archive/${commercial._id}`,
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
      accessorKey: "withRawMaterial",
      header: "With Raw Material",
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span className={value ? "text-green-500" : "text-red-500"}>
            {value ? "Yes" : "No"}
          </span>
        );
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
              <DropdownMenuItem onClick={() => handleUnarchive(commercial)}>
                Unarchive
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
          title="Archived Commercial Job Orders"
          description="View all archived commercial job orders"
        />
        <DataTableToolBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleStatusChange={handleStatusChange}
          statusFilter={statusFilter}
          navigate={() => navigate("/dashboard?tab=commercial-job-admin")}
          status={status}
          placeholder="Filter by name..."
          title="Go to Commercial Job Orders"
          name="Commercial Job Orders"
        />
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

export default ArchiveCommercialJob;
