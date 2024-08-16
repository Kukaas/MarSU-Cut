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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

// tanstack
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// icons
import { LoadingOutlined } from "@ant-design/icons";
import { CalendarIcon, Loader2, PlusCircle } from "lucide-react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

// others
import axios from "axios";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { EditAccomplishmentSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { useEffect, useState } from "react";

import DownloadButton from "./DownloadButton";
import CreateAccomplishment from "../../../forms/CreateAccomplishment";
import { token } from "@/lib/token";

const AccomplishmentReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAccomplishment, setSelectedAccomplishment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm();

  const [selectedDate, setSelectedDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 30),
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
          "https://marsu.cut.server.kukaas.tech/api/v1/accomplishment-report/all",
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
      setIsDialogOpen(true);
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
        `https://marsu.cut.server.kukaas.tech/api/v1/accomplishment-report/update/${selectedAccomplishment._id}`,
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
        setIsDialogOpen(false);
        setUpdateLoading(false);
        toast.success("Accomplishment report updated successfully!", {});
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
        toast.error("Uh oh! Something went wrong");
        setUpdateLoading(false);
      }
    } catch (error) {
      toast.error("Uh oh! Something went wrong");
      setUpdateLoading(false);
    }
  };

  // Function to delete an accomplishment report
  const handleDeleteAccomplishment = async (accomplishment) => {
    try {
      setLoadingDelete(true);
      const res = await axios.delete(
        `https://marsu.cut.server.kukaas.tech/api/v1/accomplishment-report/delete/${accomplishment._id}`,
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
          `Accomplishment with ID ${accomplishment._id} is deleted successfully!`,
          {}
        );
        setData((prevData) => {
          return prevData.filter((item) => item._id !== accomplishment._id);
        });
      } else {
        setLoadingDelete(false);
        toast.error("uh oh! Something went wrong.");
      }
    } catch (error) {
      setLoadingDelete(false);
      toast.error("uh oh! Something went wrong.");
    }
  };

  const columns = [
    {
      accessorKey: "type",
      header: "Type of Accomplishment",
    },
    {
      accessorKey: "accomplishment",
      header: "Accomplishment",
      cell: ({ row }) => (
        <div className="break-words w-52">{row.original.accomplishment}</div>
      ),
    },
    {
      accessorKey: "date",
      header: "Accomplishment Date",
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
                onClick={() =>
                  navigator.clipboard.writeText(accomplishment._id)
                }
              >
                Copy Order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSelectedAccomplishment(accomplishment)}
              >
                Edit Accomplishment
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteAccomplishment(accomplishment)}
                disabled={loadingDelete}
              >
                <span className="text-red-500 hover:text-red-400">
                  {loadingDelete ? (
                    <span className="loading-dots text-red-400">Deleting</span>
                  ) : (
                    "Delete"
                  )}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage,
        pageSize: 5,
      },
    },
  });

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => {
      const maxPage = table.getPageCount() - 1;
      return Math.min(prevPage + 1, maxPage);
    });
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
        <div className="flex items-center justify-between overflow-y-auto">
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
                      "w-[300px] justify-start text-left font-normal overflow-y-auto",
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
          <div className="flex items-center py-4 justify-between overflow-y-auto">
            <DownloadButton
              selectedDate={selectedDate}
              filteredData={filteredData}
            />
            <Tooltip title="Create Accomplishment Report">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className="m-2">
                    <PlusCircle size={20} className="mr-2" />
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
                  <CreateAccomplishment />
                </DialogContent>
              </Dialog>
            </Tooltip>
          </div>
        </div>
        <div className="rounded-md border">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= table.getPageCount() - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
