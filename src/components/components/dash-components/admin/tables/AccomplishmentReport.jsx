import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { Tooltip } from "antd";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { CalendarIcon, PlusCircle } from "lucide-react";

import axios from "axios";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState, useRef } from "react";

import DownloadButton from "./DownloadButton";
import CreateAccomplishment from "../../../forms/CreateAccomplishment";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/custom-components/CustomTable";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import CustomPageTitle from "@/components/components/custom-components/CustomPageTitle";
import { useSelector } from "react-redux";
import EditAccomplishment from "@/components/components/forms/EditAccomplishment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchEmployees } from "@/hooks/helper";
import { toast } from "sonner";

const AccomplishmentReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccomplishment, setSelectedAccomplishment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const [selectedDate, setSelectedDate] = useState({ from: null, to: null });
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("All");
  const downloadButtonRef = useRef(null);

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
          setFilteredData(fetchedData);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchAccomplishments();
  }, []);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const fetchedEmployees = await fetchEmployees();
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    getEmployees();
  }, []);

  useEffect(() => {
    if (selectedDate.from && selectedDate.to) {
      let filtered = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= selectedDate.from && itemDate <= selectedDate.to;
      });
      if (selectedEmployee !== "All") {
        filtered = filtered.filter(
          (item) => item.assignedEmployee === selectedEmployee
        );
      }
      const sortedData = filtered.sort((a, b) =>
        a.assignedEmployee.localeCompare(b.assignedEmployee)
      );
      setFilteredData(sortedData);
    } else {
      setFilteredData(data);
    }
  }, [selectedDate, data, selectedEmployee]);

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
          </div>
        );
      },
    },
  ];

  const handleCreateAccomplishment = (newAccomplishment) => {
    setData((prevData) => [newAccomplishment, ...prevData]);
  };

  const handlePrint = () => {
    if (!selectedDate.from || !selectedDate.to) {
      toast.error("Please select a date range");
      return;
    }

    let dataToPrint = filteredData;
    if (selectedEmployee !== "All") {
      dataToPrint = dataToPrint.filter(
        (item) => item.assignedEmployee === selectedEmployee
      );
    }

    if (dataToPrint.length === 0) {
      toast.error("No data to print for the selected criteria");
      return;
    }

    // Call the DownloadButton's print function with the filtered data
    if (downloadButtonRef.current) {
      downloadButtonRef.current.handlePrint(selectedDate, dataToPrint);
    }
    setIsPrintDialogOpen(false);
  };

  return (
    <>
      <div className="w-full p-5 h-screen">
        <CustomPageTitle
          title="Accomplishment Report"
          description="View, manage, and download accomplishment reports"
        />
        <div className="flex flex-wrap items-center justify-between pb-2">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {/* Removed Popover for date selection */}
          </div>
          <div className="flex items-center py-4 justify-between overflow-y-auto">
            <AlertDialog
              open={isPrintDialogOpen}
              onOpenChange={setIsPrintDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="h-8 mr-2">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Select Date Range and Employee for Printing
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Choose a date range and employee to print the accomplishment
                    report.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="startDate">Start Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="startDate"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate.from ? (
                              format(selectedDate.from, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate.from}
                            onSelect={(date) =>
                              setSelectedDate((prev) => ({
                                ...prev,
                                from: date,
                              }))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="endDate">End Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="endDate"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate.to && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate.to ? (
                              format(selectedDate.to, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate.to}
                            onSelect={(date) =>
                              setSelectedDate((prev) => ({ ...prev, to: date }))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="employee">Assigned Employee</label>
                    <Select
                      onValueChange={setSelectedEmployee}
                      defaultValue={selectedEmployee}
                    >
                      <SelectTrigger id="employee">
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Employees</SelectItem>
                        {employees.map((employee) => (
                          <SelectItem key={employee._id} value={employee.name}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <AlertDialogFooter className="w-full">
                  <AlertDialogCancel asChild>
                    <Button variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </AlertDialogCancel>
                  <Button onClick={handlePrint} className="w-full">
                    Print
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <DownloadButton
              ref={downloadButtonRef}
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
  );
};

export default AccomplishmentReport;
