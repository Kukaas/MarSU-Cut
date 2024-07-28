import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { LoadingOutlined } from "@ant-design/icons";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spin, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { ArchiveIcon, MinusCircle, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import PropTypes from "prop-types";

function Orders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [loadingClaimed, setLoadingClaimed] = useState(false);
  const [loadingArchive, setLoadingArchive] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingAdditems, setLoadingAddItems] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const toastError = () => {
    toast.error("Uh oh! Something went wrong.");
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://marsu.cut.server.kukaas.tech/api/v1/order/all"
      );
      setLoading(false);
      return response.data.orders.filter((order) => !order.isArchived);
    } catch (error) {
      setLoading(false);
      return [];
    }
  };

  // Update the status of the order to APPROVED
  const handleApprove = async (order) => {
    try {
      setLoadingApprove(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/order/update/student/${order._id}`,
        {
          status: "APPROVED",
        }
      );

      if (res.status === 200) {
        setLoadingApprove(false);
        toast.success(
          `Order of ${order.studentName} is approved successfully!`,
          {
            action: {
              label: "Ok",
            },
          }
        );
        // Correctly update the data in the state for the approved order
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === order._id) {
              // Correctly identifying the order to be updated
              return {
                ...item,
                status: "APPROVED", // Only update the status of the intended order
                schedule: res.data.schedule, // Assuming schedule needs to be updated as well
              };
            } else {
              // Return other items as is
              return item;
            }
          });
        });
      } else {
        toastError();
        setLoadingApprove(false);
      }
    } catch (error) {
      toastError();
      setLoadingApprove(false);
    }
  };

  // Update the status to DONE
  const handleDone = async (order) => {
    try {
      setLoadingDone(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/order/update/student/${order._id}`,
        {
          status: "DONE",
        }
      );

      if (res.status === 200) {
        setLoadingDone(false);
        toast.success(`Order of ${order.studentName} is ready to be claimed!`, {
          action: {
            label: "Ok",
          },
        });
        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === order._id) {
              // This is the updated item
              return {
                ...item,
                status: "DONE", // Update the status
              };
            } else {
              // This is not the updated item, return it as is
              return item;
            }
          });
        });
      } else {
        toastError();
        setLoadingDone(false);
      }
    } catch (error) {
      toastError();
      setLoadingDone(false);
    }
  };

  // Update the status to CLAIMED
  const handleClaimed = async (order) => {
    try {
      setLoadingClaimed(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/order/update/student/${order._id}`,
        {
          status: "CLAIMED",
        }
      );

      if (res.status === 200) {
        setLoadingClaimed(false);
        toast.success(`Order of ${order.studentName} is claimed!`, {
          action: {
            label: "Ok",
          },
        });
        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === order._id) {
              // This is the updated item
              return {
                ...item,
                status: "CLAIMED", // Update the status
              };
            } else {
              // This is not the updated item, return it as is
              return item;
            }
          });
        });
      } else {
        toastError();
        setLoadingClaimed(false);
      }
    } catch (error) {
      toastError();
      setLoadingClaimed(false);
    }
  };

  // Function to handle unarchive
  const handleArchive = async (order) => {
    try {
      setLoadingArchive(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/order/archive/update/${order._id}`,
        {
          isArchived: true,
        }
      );

      if (res.status === 200) {
        setLoadingArchive(false);
        toast.success(
          `Order of ${order.studentName} is archived successfully!`,
          {
            action: {
              label: "Ok",
            },
          }
        );

        setData((prevData) => {
          return prevData.filter((item) => item._id !== order._id);
        });
      } else {
        toastError();
        setLoadingArchive(false);
      }
    } catch (error) {
      {
        toastError();
        setLoadingArchive(false);
      }
    }
  };

  // Function to handle delete
  const handleDelete = async (order) => {
    try {
      setLoadingDelete(true);
      const res = await axios.delete(
        `https://marsu.cut.server.kukaas.tech/api/v1/order/student/delete/${order._id}`
      );

      if (res.status === 200) {
        setLoadingDelete(false);
        toast.success(
          `Order of ${order.studentName} is deleted successfully!`,
          {
            action: {
              label: "Ok",
            },
          }
        );

        // Update the data in the state
        setData((prevData) => {
          return prevData.filter((item) => item._id !== order._id);
        });
      } else {
        setLoadingDelete(false);
        toastError();
      }
    } catch (error) {
      setLoadingDelete(false);
      toastError();
    }
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "studentNumber",
      header: "Student Number",
    },
    {
      accessorKey: "studentName",
      header: "Student Name",
    },
    {
      accessorKey: "studentGender",
      header: "Gender",
    },
    {
      accessorKey: "receipt",
      header: "Receipt",
      cell: ({ row }) => (
        <a target="_blank" rel="noopener noreferrer">
          <img
            src={row.getValue("receipt")}
            alt="Receipt"
            style={{ width: "50px", height: "50px" }}
          />
        </a>
      ),
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
      accessorKey: "orderItems",
      header: "Order Items",
      cell: ({ row }) => {
        const orderItems = row.original.orderItems || []; // Ensure orderItems is an array

        // Check if orderItems is an empty array
        if (!Array.isArray(orderItems) || orderItems.length === 0) {
          return <div>Not yet Measured</div>;
        }

        // Group items by productType, size, and level, and sum their quantities
        const groupedItems = orderItems.reduce((acc, item) => {
          const key = `${item.productType}-${item.size}-${item.level}`;
          if (!acc[key]) {
            acc[key] = { ...item, quantity: 0 }; // Initialize if not exist
          }
          acc[key].quantity += item.quantity; // Sum the quantity
          return acc;
        }, {});

        // Convert the grouped items object back to an array for rendering
        const itemsToRender = Object.values(groupedItems);

        return (
          <div>
            {itemsToRender.map((item, index) => (
              <div key={index}>
                <span className="font-bold">{item.level}</span>:{" "}
                <span className="font-semibold">{item.productType}</span> -{" "}
                <span className="font-semibold">{item.size}</span> -{" "}
                <span className="font-semibold">{item.quantity}</span>
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
        return `Php${totalPrice.toFixed(2)}`; // Format as currency
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        let bgColor, textColor;

        switch (status) {
          case "APPROVED":
            bgColor = "bg-blue-300 bg-opacity-50";
            textColor = "text-black";
            break;
          case "MEASURED":
            bgColor = "bg-orange-300 bg-opacity-50";
            textColor = "text-black";
            break;
          case "DONE":
            bgColor = "bg-purple-300 bg-opacity-50";
            textColor = "text-black";
            break;
          case "CLAIMED":
            bgColor = "bg-green-300 bg-opacity-50";
            textColor = "text-black";
            break;
          default:
            bgColor = "bg-pink-300 bg-opacity-50";
            textColor = "text-black";
        }

        return (
          <div
            className={`capitalize ${bgColor} ${textColor} p-2 rounded-lg flex items-center justify-center h-full`}
          >
            {status}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order._id)}
              >
                Copy Order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleApprove(order)}>
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsDialogOpen(true);
                    setSelectedOrder(order);
                  }}
                >
                  Measure
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDone(order)}>
                  Done
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleClaimed(order)}>
                  Claimed
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleArchive(order)}>
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(order)}>
                <span className="text-red-500 hover:text-red-400">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    fetchOrders().then((orders) => {
      setData(orders);
      setLoading(false);
    });
  }, []);

  // Function to automatically update the unit price based on productType, size, and level
  const updateUnitPrice = (fieldName, productType, size, level) => {
    // Example logic to determine unit price based on productType, size, and level
    let unitPrice = 0;
    if (productType === "BLOUSE" && size === "S14" && level === "SHS") {
      unitPrice = 460;
    } else if (productType === "BLOUSE" && size === "S15" && level === "SHS") {
      unitPrice = 510;
    } else if (productType === "BLOUSE" && size === "S16" && level === "SHS") {
      unitPrice = 560;
    } else if (productType === "BLOUSE" && size === "S17" && level === "SHS") {
      unitPrice = 610;
    } else if (productType === "BLOUSE" && size === "S18+" && level === "SHS") {
      unitPrice = 660;
    } else if (
      productType === "BLOUSE" &&
      size === "S14" &&
      level === "COLLEGE"
    ) {
      unitPrice = 400;
    } else if (
      productType === "BLOUSE" &&
      size === "S15" &&
      level === "COLLEGE"
    ) {
      unitPrice = 450;
    } else if (
      productType === "BLOUSE" &&
      size === "S16" &&
      level === "COLLEGE"
    ) {
      unitPrice = 500;
    } else if (
      productType === "BLOUSE" &&
      size === "S17" &&
      level === "COLLEGE"
    ) {
      unitPrice = 550;
    } else if (
      productType === "BLOUSE" &&
      size === "S18+" &&
      level === "COLLEGE"
    ) {
      unitPrice = 600;
    } else if (productType === "SKIRT" && size === "S24" && level === "SHS") {
      unitPrice = 427;
    } else if (productType === "SKIRT" && size === "S25" && level === "SHS") {
      unitPrice = 477;
    } else if (productType === "SKIRT" && size === "S26" && level === "SHS") {
      unitPrice = 527;
    } else if (productType === "SKIRT" && size === "S27" && level === "SHS") {
      unitPrice = 577;
    } else if (productType === "SKIRT" && size === "S28+" && level === "SHS") {
      unitPrice = 627;
    } else if (
      productType === "SKIRT" &&
      size === "S24" &&
      level === "COLLEGE"
    ) {
      unitPrice = 350;
    } else if (
      productType === "SKIRT" &&
      size === "S25" &&
      level === "COLLEGE"
    ) {
      unitPrice = 400;
    } else if (
      productType === "SKIRT" &&
      size === "S26" &&
      level === "COLLEGE"
    ) {
      unitPrice = 450;
    } else if (
      productType === "SKIRT" &&
      size === "S27" &&
      level === "COLLEGE"
    ) {
      unitPrice = 500;
    } else if (
      productType === "SKIRT" &&
      size === "S28+" &&
      level === "COLLEGE"
    ) {
      unitPrice = 550;
    } else if (productType === "POLO" && size === "S15" && level === "SHS") {
      unitPrice = 390;
    } else if (productType === "POLO" && size === "S16" && level === "SHS") {
      unitPrice = 440;
    } else if (productType === "POLO" && size === "S17" && level === "SHS") {
      unitPrice = 490;
    } else if (productType === "POLO" && size === "S18" && level === "SHS") {
      unitPrice = 540;
    } else if (productType === "POLO" && size === "S19+" && level === "SHS") {
      unitPrice = 590;
    } else if (
      productType === "POLO" &&
      size === "S15" &&
      level === "COLLEGE"
    ) {
      unitPrice = 390;
    } else if (
      productType === "POLO" &&
      size === "S16" &&
      level === "COLLEGE"
    ) {
      unitPrice = 440;
    } else if (
      productType === "POLO" &&
      size === "S17" &&
      level === "COLLEGE"
    ) {
      unitPrice = 490;
    } else if (
      productType === "POLO" &&
      size === "S18" &&
      level === "COLLEGE"
    ) {
      unitPrice = 540;
    } else if (
      productType === "POLO" &&
      size === "S19+" &&
      level === "COLLEGE"
    ) {
      unitPrice = 590;
    } else if (productType === "PANTS" && size === "S24" && level === "SHS") {
      unitPrice = 450;
    } else if (productType === "PANTS" && size === "S25" && level === "SHS") {
      unitPrice = 500;
    } else if (productType === "PANTS" && size === "S26" && level === "SHS") {
      unitPrice = 550;
    } else if (productType === "PANTS" && size === "S27" && level === "SHS") {
      unitPrice = 600;
    } else if (productType === "PANTS" && size === "S28+" && level === "SHS") {
      unitPrice = 650;
    } else if (
      productType === "PANTS" &&
      size === "S24" &&
      level === "COLLEGE"
    ) {
      unitPrice = 450;
    } else if (
      productType === "PANTS" &&
      size === "S25" &&
      level === "COLLEGE"
    ) {
      unitPrice = 500;
    } else if (
      productType === "PANTS" &&
      size === "S26" &&
      level === "COLLEGE"
    ) {
      unitPrice = 550;
    } else if (
      productType === "PANTS" &&
      size === "S27" &&
      level === "COLLEGE"
    ) {
      unitPrice = 600;
    } else if (
      productType === "PANTS" &&
      size === "S28+" &&
      level === "COLLEGE"
    ) {
      unitPrice = 650;
    }
    // Add more conditions as needed...
    // Update the form field for unitPrice
    form.setValue(`orderItems[${fieldName}].unitPrice`, unitPrice);
  };

  const table = useReactTable({
    data,
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
    },
  });

  const rowsPerPage = 5;

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(
        prevPage + 1,
        Math.floor(table.getRowModel().rows.length / rowsPerPage)
      )
    );
  };

  const displayedRows = table
    .getRowModel()
    .rows.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  const form = useForm({
    defaultValues: {
      orderItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "orderItems",
  });

  const handleAddItems = async (values) => {
    setLoadingAddItems(true);

    // Ensure orderItems is an array
    const orderItems = Array.isArray(values.orderItems)
      ? values.orderItems
      : [];

    const res = await axios.put(
      `https://marsu.cut.server.kukaas.tech/api/v1/order/add-item/${selectedOrder._id}`,
      {
        orderItems: orderItems,
      }
    );

    if (res.status === 200) {
      toast.success(`The student ${selectedOrder.studentName} is measured`, {
        action: {
          label: "Ok",
        },
      });
    } else {
      toastError();
    }

    setLoadingAddItems(false);
  };

  const onSubmit = async (values) => {
    await handleAddItems(values);
    form.reset();
  };

  const OrderItemForm = ({ index, form, updateUnitPrice, remove }) => {
    const { watch, getValues } = form;
    const level = watch(`orderItems[${index}].level`);
    const productType = watch(`orderItems[${index}].productType`);
    const size = watch(`orderItems[${index}].size`);

    useEffect(() => {
      updateUnitPrice(index, productType, size, level);
    }, [level, productType, size, index, updateUnitPrice]);

    return (
      <div key={index} className="flex gap-4 w-full items-center">
        <Controller
          control={form.control}
          name={`orderItems[${index}].level`}
          rules={{ required: "Missing level" }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-15 overflow-y-auto" variant="outline">
                      {field.value || "Level"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        const { productType, size } = getValues([
                          `orderItems[${index}].productType`,
                          `orderItems[${index}].size`,
                        ]);
                        updateUnitPrice(index, productType, size, "SHS");
                        field.onChange("SHS");
                      }}
                    >
                      SHS
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const { productType, size } = getValues([
                          `orderItems[${index}].productType`,
                          `orderItems[${index}].size`,
                        ]);
                        updateUnitPrice(index, productType, size, "COLLEGE");
                        field.onChange("COLLEGE");
                      }}
                    >
                      COLLEGE
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          control={form.control}
          name={`orderItems[${index}].productType`}
          rules={{ required: "Missing product type" }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-15 overflow-y-auto" variant="outline">
                      {field.value || "Type"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[
                      "SKIRT",
                      "POLO",
                      "PANTS",
                      "BLOUSE",
                      "PE TSHIRT",
                      "PE JOGGING PANT",
                    ].map((type) => (
                      <DropdownMenuItem
                        key={type}
                        onClick={() => {
                          const { level, size } = getValues([
                            `orderItems[${index}].level`,
                            `orderItems[${index}].size`,
                          ]);
                          updateUnitPrice(index, type, size, level);
                          field.onChange(type);
                        }}
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          control={form.control}
          name={`orderItems[${index}].size`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-15 overflow-y-auto" variant="outline">
                      {field.value || "Size"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-48 overflow-y-auto">
                    {[
                      "S14",
                      "S15",
                      "S16",
                      "S17",
                      "S18",
                      "S18+",
                      "S19+",
                      "S24",
                      "S25",
                      "S26",
                      "S27",
                      "S28+",
                    ].map((size) => (
                      <DropdownMenuItem
                        key={size}
                        onClick={() => {
                          const { productType, level } = getValues([
                            `orderItems[${index}].productType`,
                            `orderItems[${index}].level`,
                          ]);
                          updateUnitPrice(index, productType, size, level);
                          field.onChange(size);
                        }}
                      >
                        {size}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`orderItems[${index}].unitPrice`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Tooltip title="Unit Price" className="cursor-pointer">
                  <Input
                    {...field}
                    placeholder="Unit Price"
                    type="number"
                    readOnly
                    className="w-full"
                  />
                </Tooltip>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`orderItems[${index}].quantity`}
          rules={{ required: "Missing quantity" }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Tooltip title="Quantity" className="cursor-pointer">
                  <Input {...field} placeholder="Quantity" type="number" />
                </Tooltip>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <MinusCircle
          onClick={() => remove(index)}
          style={{ width: "50px", height: "50px" }} // Adjust the size as needed
          className="cursor-pointer"
        />
      </div>
    );
  };

  OrderItemForm.propTypes = {
    index: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    updateUnitPrice: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  };

  return (
    <Spin
      spinning={
        loadingApprove ||
        loadingClaimed ||
        loadingDone ||
        loadingArchive ||
        loadingDelete
      }
      indicator={
        <LoadingOutlined className="dark:text-white" style={{ fontSize: 48 }} />
      }
    >
      <div className="w-full p-4 h-screen">
        <div className="flex items-center py-4 justify-between">
          <Input
            placeholder="Filter Student Numbers..."
            value={table.getColumn("studentNumber")?.getFilterValue() || ""}
            onChange={(event) =>
              table
                .getColumn("studentNumber")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Tooltip title="Archive Orders">
            <Button
              variant="default"
              className="m-2"
              onClick={() => navigate("/dashboard?tab=archive-orders")}
            >
              <ArchiveIcon size={20} className="mr-2" />
              Archive
            </Button>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
                {displayedRows.length ? (
                  displayedRows.map((row) => (
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
              disabled={
                (currentPage + 1) * rowsPerPage >=
                table.getRowModel().rows.length
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Order Items</DialogTitle>
            <DialogDescription>
              Please fill out the form below to add items to your order.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              {fields.map((field, index) => (
                <OrderItemForm
                  key={field.id}
                  index={index}
                  form={form}
                  updateUnitPrice={updateUnitPrice}
                  remove={remove}
                />
              ))}
              <Tooltip title="Add fields">
                <PlusCircle
                  onClick={() =>
                    append({
                      level: "",
                      productType: "",
                      size: "",
                      unitPrice: 0,
                      quantity: 0,
                    })
                  }
                  className="mt-5 w-full cursor-pointer"
                />
              </Tooltip>
              <div className="flex justify-end items-center">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="mr-2 mt-4"
                    onClick={() => form.reset()}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="mt-4"
                  onClick={() => handleAddItems(form.getValues)}
                >
                  {loadingAdditems ? (
                    <div className="loading-dots">Adding Items</div>
                  ) : (
                    "Add Items"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Spin>
  );
}

export default Orders;
