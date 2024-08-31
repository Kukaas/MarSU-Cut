// UI
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Spin, Tooltip, Typography } from "antd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// icons
import { LoadingOutlined } from "@ant-design/icons";
import { CalendarIcon, Loader2, PlusCircle } from "lucide-react";

// others
import axios from "axios";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { EditAccomplishmentSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";

import DownloadButton from "./DownloadButton";
import CreateAccomplishment from "../../../forms/CreateAccomplishment";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import ToasterError from "@/lib/Toaster";
import CustomTable from "@/components/components/CustomTable";
import DataTableColumnHeader from "@/components/components/DataTableColumnHeader";

const AccomplishmentReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedAccomplishment, setSelectedAccomplishment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);
  const form = useForm();

  const [selectedDate, setSelectedDate] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSelect = (selectedDateRange) => {
    setSelectedDate(selectedDateRange);
  };

  useEffect(() => {
    const fetchAccomplishments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/api/v1/accomplishment-report/all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          const fetchedData = res.data.accomplishmentReports;
          setData(fetchedData);
          filterData(fetchedData, selectedDate); // Apply initial filter
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchAccomplishments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterData(data, selectedDate);
  }, [selectedDate, data]);

  const formAccomplishment = useForm({
    resolver: zodResolver(EditAccomplishmentSchema),
    defaultValues: {
      type: "",
      accomplishment: "",
    },
  });

  useEffect(() => {
    if (selectedAccomplishment) {
      formAccomplishment.reset({
        type: selectedAccomplishment.type,
        accomplishment: selectedAccomplishment.accomplishment,
      });
      setIsDialogEditOpen(true);
    } else {
      formAccomplishment.reset({
        type: "",
        accomplishment: "",
      });
    }
  }, [selectedAccomplishment, formAccomplishment]);

  const filterData = (data, dateRange) => {
    if (!dateRange) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate >= new Date(dateRange.from) &&
        itemDate <= new Date(dateRange.to)
      );
    });
    setFilteredData(filtered);
  };

  const handleEditAccomplishment = async (values, event) => {
    try {
      event.preventDefault();
      event.stopPropagation();
      setUpdateLoading(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/accomplishment-report/update/${selectedAccomplishment._id}`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setIsDialogEditOpen(false);
        setUpdateLoading(false);
        toast.success("Accomplishment report updated successfully!");
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === selectedAccomplishment._id) {
              return { ...item, ...values };
            }
            return item;
          });
        });
        form.reset();
      } else {
        ToasterError();
        setUpdateLoading(false);
      }
    } catch (error) {
      ToasterError({
        description: "Please check you internet connection and try again.",
      });
      setUpdateLoading(false);
    }
  };

  // Function to delete an accomplishment report
  const handleDeleteAccomplishment = async (accomplishment) => {
    try {
      setLoadingDelete(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/accomplishment-report/delete/${accomplishment._id}`,
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
        toast.success(
          `Accomplishment with ID ${accomplishment._id} is deleted successfully!`
        );
        setData((prevData) => {
          return prevData.filter((item) => item._id !== accomplishment._id);
        });
      } else {
        setLoadingDelete(false);
        ToasterError();
      }
    } catch (error) {
      setLoadingDelete(false);
      ToasterError({
        description: "Please check you internet connection and try again.",
      });
    }
  };

  const columns = [
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type of Accomplishment" />
      ),
    },
    {
      accessorKey: "accomplishment",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Accomplishment" />
      ),
      cell: ({ row }) => (
        <div className="break-words w-52">{row.original.accomplishment}</div>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Accomplishment Date" />
      ),
      cell: ({ row }) => {
        const accomplishmentDate = new Date(row.original.date);
        return accomplishmentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
      sortingFn: (a, b) =>
        new Date(a.original.date) - new Date(b.original.date),
    },
    {
      accessorKey: "remarks",
      header: "Remarks",
      cell: ({ row }) => {
        const remarks = row.original.remarks;
        if (!remarks) {
          return "N/A";
        }
        const transformedRemarks =
          remarks.charAt(0).toUpperCase() + remarks.slice(1).toLowerCase();
        return transformedRemarks;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const accomplishment = row.original;

        return (
          <div className="flex items-center justify-center space-x-2">
            <Tooltip title="Edit Accomplishment">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setSelectedAccomplishment(accomplishment);
                      setIsDialogEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                      Please fill out the form below to edit product.
                    </DialogDescription>
                  </DialogHeader>
                  <EditAccomplishmentSchema
                    selectedAccomplishment={selectedAccomplishment}
                  />
                </DialogContent>
              </Dialog>
            </Tooltip>
            <Tooltip title="Delete Accomplishment">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Accomplishment</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this accomplishment?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center justify-end gap-2">
                    <DialogClose>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteAccomplishment(accomplishment)}
                    >
                      Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const handleCreateAccomplishment = (newAccomplishment) => {
    setData((prevData) => [newAccomplishment, ...prevData]);
  };

  return (
    <Spin
      spinning={loadingDelete}
      indicator={
        <LoadingOutlined className="dark:text-white" style={{ fontSize: 48 }} />
      }
    >
      <div className="w-full p-5 h-screen">
        <Typography.Title level={2} className="text-black dark:text-white">
          Accomplishment Report
        </Typography.Title>
        <div className="flex flex-wrap items-center justify-between pb-2">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className={cn("grid gap-2")}>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <Tooltip
                  title={
                    selectedDate?.from ? (
                      <>
                        <span>
                          {selectedDate?.from &&
                            format(selectedDate.from, "LLL dd, y")}{" "}
                          -{" "}
                        </span>
                        <span>
                          {selectedDate?.to &&
                            format(selectedDate.to, "LLL dd, y")}
                        </span>
                      </>
                    ) : (
                      "Please select a date"
                    )
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "h-8 w-[250px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate?.from ? (
                        selectedDate.to ? (
                          <>
                            {format(selectedDate.from, "LLL dd, y")} -{" "}
                            {format(selectedDate.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(selectedDate.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                </Tooltip>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={selectedDate?.from}
                    selected={selectedDate}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                  />
                  <div className="flex justify-end gap-2 p-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsPopoverOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedDate(null);
                        setIsPopoverOpen(false);
                      }}
                    >
                      Show All
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex items-center py-4 justify-between overflow-y-auto">
            <DownloadButton
              selectedDate={selectedDate}
              filteredData={filteredData}
            />
            <Tooltip title="Create Accomplishment Report">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" className="m-2 h-8">
                    <PlusCircle size={20} className="mr-2 h-4 w-4" />
                    Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create an Accomplishment</DialogTitle>
                    <DialogDescription>
                      Click create when you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateAccomplishment
                    onAccomplishmentCreate={handleCreateAccomplishment}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                </DialogContent>
              </Dialog>
            </Tooltip>
          </div>
        </div>
        <div className="rounded-md border">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : (
            <CustomTable columns={columns} data={filteredData} />
          )}
        </div>
      </div>
      <Dialog open={isDialogEditOpen} onOpenChange={setIsDialogEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Accomplishment</DialogTitle>
            <DialogDescription>
              Edit the selected accomplishment details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...formAccomplishment}>
            <form
              onSubmit={formAccomplishment.handleSubmit(
                handleEditAccomplishment
              )}
            >
              <FormField
                control={formAccomplishment.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Accomplishment</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formAccomplishment.control}
                name="accomplishment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accomplishment</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end items-center">
                <DialogClose asChild>
                  <Button variant="outline" className="mr-2 mt-4">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="mt-4" disabled={updateLoading}>
                  {updateLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 animate-spin" />
                      <span>Saving</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Spin>
  );
};

export default AccomplishmentReport;
