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

import { Spin, Tooltip } from "antd";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import CreateRental from "../../../forms/CreateRental";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { token } from "@/lib/token";
import ToasterError from "@/lib/Toaster";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/custom-components/CustomTable";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import { statusColors } from "@/lib/utils";
import RentalDetails from "../../admin/tables/details/RentalDetails";
import { AlertDialog } from "@/components/ui/alert-dialog";
import CustomPageTitle from "@/components/components/custom-components/CustomPageTitle";

function Rentals() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(true);
  const [selectedRental, setSelectedRental] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  // Fetch the data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/v1/rental/${currentUser._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setLoading(false);
      setData(res.data.rental);
    };

    fetchData();
  }, [currentUser._id]);

  // Function to handle delete
  const handleDelete = async (rental) => {
    try {
      setLoadingDelete(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/rental/${rental._id}`,
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
        toast.success(`Rental whith rental ID ${rental._id} has been deleted!`);

        // Update the data in the state
        setData((prevData) => {
          return prevData.filter((item) => item._id !== rental._id);
        });
      } else {
        ToasterError();
        setLoadingDelete(false);
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
      setLoadingDelete(false);
    }
  };

  const columns = [
    {
      accessorKey: "coordinatorName",
      header: "Name",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "possiblePickupDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date Needed" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("possiblePickupDate"));
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "pickupDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pickup Date" />
      ),
      cell: ({ row }) => {
        const dateValue = row.getValue("pickupDate");
        if (!dateValue) {
          return "Not set"; // Render "Not set" if there's no date
        }
        const date = new Date(dateValue);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "returnDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Return Date" />
      ),
      cell: ({ row }) => {
        const dateValue = row.getValue("returnDate");
        if (!dateValue) {
          return "Not set"; // Render "Not set" if there's no date
        }
        const date = new Date(dateValue);
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
        const rental = row.original;

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
                  setSelectedRental(rental);
                  setDetailsDialogOpen(true);
                }}
              >
                Show Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(rental)}
                disabled={["APPROVED", "GIVEN", "RETURNED"].includes(
                  rental.status
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

  const handleRentalCreated = (newRental) => {
    setData((prevData) => [...prevData, newRental]);
  };

  return (
    <Spin
      spinning={loadingDelete}
      indicator={
        <LoadingOutlined className="dark:text-white" style={{ fontSize: 48 }} />
      }
    >
      <div className="w-full p-5 h-screen">
        <CustomPageTitle
          title="Rentals"
          description="View and manage rentals"
        />
        <div className="flex items-center py-4 justify-end overflow-auto">
          <Tooltip title="Create a rental">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="m-2 h-8">
                  <PlusCircle size={20} className="mr-2 h-4 w-4" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[550px] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Create a rental</DialogTitle>
                  <DialogDescription>
                    Click submit when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <CreateRental
                  onRentalCreated={handleRentalCreated}
                  setIsDialogOpen={setIsDialogOpen}
                />
              </DialogContent>
            </Dialog>
          </Tooltip>
        </div>
        <div className="rounded-md border">
          <CustomTable columns={columns} data={data} loading={loading} />
        </div>
      </div>
      <AlertDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <RentalDetails
          setDetailsDialogOpen={setDetailsDialogOpen}
          selectedRental={selectedRental}
        />
      </AlertDialog>
    </Spin>
  );
}

export default Rentals;
