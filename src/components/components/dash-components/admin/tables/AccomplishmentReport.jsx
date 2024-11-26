// UI
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { Tooltip } from "antd";
import { Button } from "@/components/ui/button";

// icons
// import { LoadingOutlined } from "@ant-design/icons";
import { CalendarIcon, PlusCircle } from "lucide-react";

// others
import axios from "axios";
import { cn } from "@/lib/utils";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";

import DownloadButton from "./DownloadButton";
import CreateAccomplishment from "../../../forms/CreateAccomplishment";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/custom-components/CustomTable";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
// import DeleteDialog from "@/components/components/custom-components/DeleteDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CustomPageTitle from "@/components/components/custom-components/CustomPageTitle";
import { useSelector } from "react-redux";
import EditAccomplishment from "@/components/components/forms/EditAccomplishment";

const AccomplishmentReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedAccomplishment, setSelectedAccomplishment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

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

  const handleEditAccomplishment = (updatedAccomplishment) => {
    setData((prevData) =>
      prevData.map((item) =>
        item._id === updatedAccomplishment._id ? updatedAccomplishment : item
      )
    );
  };

  const columns = [
    {
      accessorKey: "assignedEmployee",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Assigned Employee" />
      ),
    },
    {
      accessorKey: "accomplishmentType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type of Accomplishment" />
      ),
    },
    {
      accessorKey: "product",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product Type" />
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const quantity = row.original.quantity;

        return <span>{quantity} pcs</span>;
      },
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setSelectedAccomplishment(accomplishment);
                    }}
                  >
                    Edit
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Edit Accomplishment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Make changes to the accomplishment here. Click save when
                      you&apos;re done.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <EditAccomplishment
                    accomplishment={selectedAccomplishment}
                    onAccomplishmentUpdate={handleEditAccomplishment}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                </AlertDialogContent>
              </AlertDialog>
            </Tooltip>
            {/* <Tooltip title="Delete Accomplishment">
              <DeleteDialog
                item={`accompishment with ID ${accomplishment?._id}`}
                handleDelete={() => handleDeleteAccomplishment(accomplishment)}
              />
            </Tooltip> */}
          </div>
        );
      },
    },
  ];

  const handleCreateAccomplishment = (newAccomplishment) => {
    setData((prevData) => [newAccomplishment, ...prevData]);
  };

  return (
    // <Spin
    //   spinning={loadingDelete}
    //   indicator={
    //     <LoadingOutlined className="dark:text-white" style={{ fontSize: 48 }} />
    //   }
    // >
    <>
      <div className="w-full p-5 h-screen">
        <CustomPageTitle
          title="Accomplishment Report"
          description="View, manage, and download accomplishment reports"
        />
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
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {currentUser.role === "Admin" && currentUser.isAdmin && (
                  <AlertDialogTrigger asChild>
                    <Button variant="default" className="m-2 h-8">
                      <PlusCircle size={20} className="mr-2 h-4 w-4" />
                      Create
                    </Button>
                  </AlertDialogTrigger>
                )}
                <AlertDialogContent className="sm:max-w-[425px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Create an Accomplishment
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Click create when you&apos;re done.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <CreateAccomplishment
                    onAccomplishmentCreate={handleCreateAccomplishment}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                </AlertDialogContent>
              </AlertDialog>
            </Tooltip>
          </div>
        </div>
        <div className="rounded-md border">
          <CustomTable
            columns={columns}
            data={filteredData}
            loading={loading}
          />
        </div>
      </div>
    </>
    // </Spin>
  );
};

export default AccomplishmentReport;
