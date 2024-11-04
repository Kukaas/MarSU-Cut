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
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialog,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Spin, Typography } from "antd";
import { toast } from "sonner";

// icons
import { LoadingOutlined } from "@ant-design/icons";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

// others
import { useNavigate } from "react-router-dom";
import ToasterError from "@/lib/Toaster";
import { useState, useEffect } from "react";
import axios from "axios";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/custom-components/CustomTable";
import { statusColors } from "@/lib/utils";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import DataTableToolBar from "@/components/components/custom-components/DataTableToolBar";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPickUpDateSchema } from "@/schema/shema";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import RentalDetails from "./details/RentalDetails";

function Rentals() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(true);
  const [selectedRental, setSelectedRental] = useState(null);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(addPickUpDateSchema),
    defaultValues: {
      possiblePickupDate: null,
    },
  });

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/rental/all/get`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const activeRentals = res.data.rentals.filter(
          (rental) => !rental.isArchived
        );

        setData(activeRentals);
        setOriginalData(activeRentals);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  useEffect(() => {
    if (searchValue) {
      const filteredData = originalData.filter((order) =>
        order.coordinatorName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setData(filteredData);
    } else {
      setData(originalData);
    }
  }, [searchValue, originalData]);

  const handlePickupDateUpdate = async () => {
    // Use form.getValues to access the form values
    const { pickupDate: selectedDate } = form.getValues();
    if (selectedRental.status !== "APPROVED") {
      toast.error("Rental must be approved first!");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date");
      return; // Early return if no date is selected
    }

    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/rental/pickup-date/${selectedRental._id}`,
        { pickupDate: selectedDate }, // Send the selected date
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
          `Pickup date for ${selectedRental.coordinatorName} has been set!`
        );
        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === selectedRental._id) {
              return { ...item, pickupDate: selectedDate }; // Update with selected date
            }
            return item;
          });
        });
        setDialogOpen(false); // Close the dialog
      } else {
        ToasterError();
      }
    } catch (error) {
      ToasterError();
    } finally {
      setLoadingUpdate(false); // Make sure to reset loading state
    }
  };

  const handleReject = async (rental) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/rental/update/${rental._id}`,
        { status: "REJECTED" },
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
          `Rental of ${rental.coordinatorName} is rejected successfully!`
        );

        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === rental._id) {
              return { ...item, status: "REJECTED" };
            }

            return item;
          });
        });
      } else {
        ToasterError();
        setLoadingUpdate(false);
      }
    } catch (error) {
      ToasterError();
      setLoadingUpdate(false);
    }
  };

  // Update the status of the rental to approved
  const handleApprove = async (rental) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/rental/update/${rental._id}`,
        { status: "APPROVED" },
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
          `Rental of ${rental.coordinatorName} is approved successfully!`
        );

        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === rental._id) {
              return { ...item, status: "APPROVED" };
            }

            return item;
          });
        });
      } else {
        ToasterError();
        setLoadingUpdate(false);
      }
    } catch (error) {
      ToasterError();
      setLoadingUpdate(false);
    }
  };

  const handleGiven = async (rental) => {
    if (!rental.pickupDate) {
      return toast.error("Please set the pickup date first!");
    }
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/rental/update/${rental._id}`,
        {
          status: "GIVEN",
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
        toast.success(`Rental of ${rental.coordinatorName} is given!`);

        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === rental._id) {
              return { ...item, status: "GIVEN" }; // Correct status update
            }
            return item;
          });
        });
      } else {
        ToasterError();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message); // Correct error handling
      } else {
        ToasterError({
          description: "Please check you internet connection and try again.",
        }); // Handle other errors
      }
      setLoadingUpdate(false);
    }
  };

  // Update the status of the rental to returned
  const handleReturn = async (rental) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/rental/update/${rental._id}`,
        {
          status: "RETURNED",
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
        toast.success(`Rental of ${rental.coordinatorName} is returned!`);

        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === rental._id) {
              return { ...item, status: "RETURNED" };
            }

            return item;
          });
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

  // Archive the rental
  const handleArchive = async (rental) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/rental/archive/update/${rental._id}`,
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
        setLoadingUpdate(false);
        toast.success(
          `Rental of ${rental.coordinatorName} is archived successfully!`
        );

        setData((prevData) => {
          return prevData.filter((item) => item._id !== rental._id);
        });
      } else {
        ToasterError();
        setLoadingUpdate(false);
      }
    } catch (error) {
      {
        ToasterError({
          description: "Please check you internet connection and try again.",
        });
        setLoadingUpdate(false);
      }
    }
  };

  // Delete the rental
  // const handleDelete = async (rental) => {
  //   try {
  //     setLoadingUpdate(true);
  //     const res = await axios.delete(
  //       `${BASE_URL}/api/v1/rental/${rental._id}`,
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
  //       toast.success(
  //         `Rental of ${rental.coordinatorName} is deleted successfully!`
  //       );
  //       // Update the data in the state
  //       setData((prevData) => {
  //         return prevData.filter((item) => item._id !== rental._id);
  //       });
  //     } else {
  //       ToasterError();
  //       setLoadingUpdate(false);
  //     }
  //   } catch (error) {
  //     ToasterError({
  //       description: "Please check you internet connection and try again.",
  //     });
  //     setLoadingUpdate(false);
  //   }
  // };

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
        return (
          <span className="text-sm">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        );
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
          return (
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedRental(row.original); // Set selected rental
                setDialogOpen(true); // Open the dialog
              }}
            >
              Set Date
            </Button>
          );
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
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleReject(rental)}
                  disabled={["APPROVED", "GIVEN", "RETURNED"].includes(
                    rental.status
                  )}
                >
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleApprove(rental)}
                  disabled={["APPROVED", "GIVEN", "RETURNED"].includes(
                    rental.status
                  )}
                >
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleGiven(rental)}
                  disabled={[
                    "REJECTED",
                    "GIVEN",
                    "RETURNED",
                    "PENDING",
                  ].includes(rental.status)}
                >
                  Given
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleReturn(rental)}
                  disabled={[
                    "REJECTED",
                    "APPROVED",
                    "RETURNED",
                    "PENDING",
                  ].includes(rental.status)}
                >
                  Returned
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleArchive(rental)}>
                Archive
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => handleDelete(rental)}>
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
    GIVEN: "GIVEN",
    RETURNED: "RETURNED",
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
        <Typography.Title level={2} className="text-black dark:text-white">
          Rentals
        </Typography.Title>
        <DataTableToolBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleStatusChange={handleStatusChange}
          statusFilter={statusFilter}
          navigate={() => navigate("/dashboard?tab=archive-rentals")}
          status={status}
          placeholder="Filter by coordinator name..."
        />
        <div className="rounded-md border">
          <CustomTable columns={columns} data={data} loading={loading} />
        </div>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Set Pickup Date</AlertDialogTitle>
            <AlertDialogDescription>
              This will be the date the coordinator will pick up the rental
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4">
            <Form {...form}>
              <form>
                <FormField
                  control={form.control}
                  name="pickupDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Pick up Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Add Pick Up Date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const possiblePickupDate =
                                selectedRental?.possiblePickupDate
                                  ? new Date(selectedRental.possiblePickupDate)
                                  : null;
                              const today = new Date().setHours(0, 0, 0); // Current date at midnight

                              const day = date.getDay(); // Get the day of the week (0-6, where 0 is Sunday)

                              return (
                                (possiblePickupDate &&
                                  date > possiblePickupDate) || // Disable dates after possible pickup date
                                date < today || // Disable past dates
                                day === 0 || // Disable Sundays
                                day === 6 // Disable Saturdays
                              );
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <div className="p-4 flex justify-end gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="primary" onClick={handlePickupDateUpdate}>
                Confirm
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
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
