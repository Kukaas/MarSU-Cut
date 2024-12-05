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
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";

// others
import { cn } from "@/lib/utils";
import { CreateRentalSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ToasterError from "@/lib/Toaster";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomInput from "../custom-components/CustomInput";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import SelectField from "../custom-components/SelectField";
import { Input } from "@/components/ui/input";

// Utility function to determine stock color
const getStockColorClass = (quantity) => {
  if (quantity === 0) return "text-red-500 text-sm";
  if (quantity < 15) return "text-orange-500 text-sm";
  return "text-green-500 text-sm";
};

const CreateRental = ({ onRentalCreated, setIsDialogOpen }) => {
  const [finishedProducts, setFinishedProducts] = useState({
    toga: {
      S14: 0,
      S16: 0,
      S17: 0,
      S18: 0,
      S19: 0,
      S20: 0,
      "S20+": 0,
    },
    cap: {
      "M/L": 0,
      XL: 0,
      XXL: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const initialFormState = JSON.parse(
    localStorage.getItem("createRentalForm")
  ) || {
    coordinatorGender: "",
    department: "",
    possiblePickupDate: "",
    toga: {
      S14: 0,
      S15: 0,
      S16: 0,
      S17: 0,
      S18: 0,
      S19: 0,
      S20: 0,
      "S20+": 0,
    },
    hood: 0,
    cap: {
      "M/L": 0,
      XL: 0,
      XXL: 0,
    },
    monacoThread: 0,
  };
  const [formState, setFormState] = useState(initialFormState);

  const form = useForm({
    resolver: zodResolver(CreateRentalSchema),
    defaultValues: {
      ...formState,
      coordinatorName: currentUser.name,
      department: currentUser.department,
      possiblePickupDate: "",
      toga: {
        S14: 0,
        S15: 0,
        S16: 0,
        S17: 0,
        S18: 0,
        S19: 0,
        S20: 0,
        "S20+": 0,
      },
      hood: 0,
      cap: {
        "M/L": 0,
        XL: 0,
        XXL: 0,
      },
      monacoThread: 0,
    },
  });

  useEffect(() => {
    const formValues = form.watch((values) => {
      setFormState(values);
      localStorage.setItem("createRentalForm", JSON.stringify(values));
    });

    return () => formValues.unsubscribe();
  }, [form]);

  useEffect(() => {
    const fetchFinishedProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/academic-gown/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (res.status === 200) {
          const academicGowns = res.data.academicGown.reduce(
            (acc, product) => {
              if (product.productType === "TOGA") {
                acc.toga[product.size] = product.quantity;
              } else if (product.productType === "CAP") {
                acc.cap[product.size] = product.quantity;
              } else if (product.productType === "HOOD") {
                // Assuming the productType for Hood is "HOOD"
                acc.hood = product.quantity; // Assuming hood is a single quantity
              } else if (product.productType === "MONACO_THREAD") {
                // Assuming the productType for Monaco Thread is "MONACO_THREAD"
                acc.monacoThread = product.quantity; // Assuming monacoThread is a single quantity
              }
              return acc;
            },
            {
              toga: {
                S14: 0,
                S15: 0,
                S16: 0,
                S17: 0,
                S18: 0,
                S19: 0,
                S20: 0,
                "S20+": 0,
              },
              cap: {
                "M/L": 0,
                XL: 0,
                XXL: 0,
              },
              hood: 0, // Initialize hood if it isn't already
              monacoThread: 0, // Initialize monacoThread if it isn't already
            }
          );

          setFinishedProducts(academicGowns); // Update state with the fetched data
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFinishedProducts();
  }, []);

  const departmentOptions = [
    "College of Agriculture(Torrijos Campus)",
    "College of Allied Health Sciences",
    "College of Arts and Social Sciences",
    "College of Business and Accountancy",
    "College of Criminal Justice Education",
    "College of Education",
    "College of Engineering",
    "College of Environmental Studies",
    "College of Fisheries and Aquatic Sciences(Gasan Campus)",
    "College of Governance",
    "College of Industrial Technology",
    "College of Information and Computing Sciences",
  ];

  const handleCreateRental = async (values) => {
    console.log(values); // Check if toga and cap values are properly captured
    if (
      !values.coordinatorName ||
      !values.department ||
      !values.possiblePickupDate
    ) {
      return toast.error("Please fill all fields");
    }

    if (values.rentalDate > values.returnDate) {
      return toast.error("Return date must be greater than rental date");
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/rental/create`,
        {
          ...values,
          coordinatorEmail: currentUser.email,
          userId: currentUser._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        setLoading(false);
        form.reset();
        toast.success("Rental submitted successfully!", {
          description: "Wait for the admin to approve your rental",
        });
        onRentalCreated(res.data.savedRental);
        setIsDialogOpen(false);
        console.log(res.data);
      }
    } catch (error) {
      setLoading(false);
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 py-4 overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateRental)}
          className="space-y-6 w-full overflow-y-auto"
        >
          {/* Personal Details Section */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">Personal Details</legend>
            <div className="space-y-4">
              <CustomInput
                form={form}
                name="coordinatorName"
                label="Coordinator Name"
                placeholder="eg. John Doe"
                type="disabled"
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <SelectField
                    field={field}
                    label="Department"
                    options={departmentOptions}
                    placeholder="Department"
                    type="disabled"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="possiblePickupDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Needed</FormLabel>
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
                              format(field.value, "MMMM dd, yyyy")
                            ) : (
                              <span>Pick a date</span>
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
                          disabled={(date) =>
                            date < new Date().setHours(0, 0, 0, 0)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          {/* Finished Products Section */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">Toga Sizes</legend>
            <div className="space-y-4">
              <div className="space-y-2">
                {finishedProducts.toga &&
                  Object.keys(finishedProducts.toga).map((size) => (
                    <FormField
                      key={size}
                      control={form.control}
                      name={`toga.${size}`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <div className="flex gap-2 items-center">
                            <FormLabel>{size}</FormLabel>
                            <span
                              className={getStockColorClass(
                                finishedProducts.toga[size]
                              )}
                            >
                              ({finishedProducts.toga[size]})
                            </span>
                          </div>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Quantity"
                            value={field.value || ""} // Use an empty string if value is not set
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value, 10);
                              // Only update if the value is a valid number (or empty, to handle clearing the input)
                              field.onChange(isNaN(newValue) ? "" : newValue);
                              if (newValue < 0) {
                                field.onChange(0);
                              }
                            }}
                          />
                        </FormItem>
                      )}
                    />
                  ))}
              </div>
            </div>
          </fieldset>

          {/* Cap Section */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">Cap Sizes</legend>
            <div className="space-y-2">
              {finishedProducts.cap &&
                Object.keys(finishedProducts.cap).map((size) => (
                  <FormField
                    key={size}
                    control={form.control}
                    name={`cap.${size}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <div className="flex gap-2 items-center">
                          <FormLabel>{size}</FormLabel>
                          <span
                            className={getStockColorClass(
                              finishedProducts.cap[size]
                            )}
                          >
                            ({finishedProducts.cap[size]})
                          </span>
                        </div>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Quantity"
                          value={field.value || ""} // Use an empty string if value is not set
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value, 10);
                            // Only update if the value is a valid number (or empty, to handle clearing the input)
                            field.onChange(isNaN(newValue) ? "" : newValue);
                            if (newValue < 0) {
                              field.onChange(0);
                            }
                          }}
                        />
                      </FormItem>
                    )}
                  />
                ))}
            </div>
          </fieldset>

          {/* Hood Section */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">Hood</legend>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="hood"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <FormLabel>Hood</FormLabel>
                      <span
                        className={getStockColorClass(finishedProducts.hood)}
                      >
                        ({finishedProducts.hood}){" "}
                      </span>
                    </div>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Quantity"
                      value={field.value || ""} // Use an empty string if value is not set
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value, 10);
                        // Only update if the value is a valid number (or empty, to handle clearing the input)
                        field.onChange(isNaN(newValue) ? "" : newValue);
                        if (newValue < 0) {
                          field.onChange(0);
                        }
                      }}
                    />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          {/* Monaco Thread Section */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">Monaco Thread</legend>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="monacoThread"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <FormLabel>Monaco Thread</FormLabel>
                      <span
                        className={getStockColorClass(
                          finishedProducts.monacoThread
                        )}
                      >
                        ({finishedProducts.monacoThread}){" "}
                        {/* Display available quantity */}
                      </span>
                    </div>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Quantity"
                      value={field.value || ""} // Use an empty string if value is not set
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value, 10);
                        // Only update if the value is a valid number (or empty, to handle clearing the input)
                        field.onChange(isNaN(newValue) ? "" : newValue);
                        if (newValue < 0) {
                          field.onChange(0);
                        }
                      }}
                    />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          {/* Submit Button */}
          <div className="flex flex-col items-center">
            <AlertDialogFooter className="flex flex-col items-center w-full gap-2">
              <AlertDialogCancel asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Submit"
                )}
              </Button>
            </AlertDialogFooter>
          </div>
        </form>
      </Form>
    </div>
  );
};

CreateRental.propTypes = {
  onRentalCreated: PropTypes.func.isRequired,
  setIsDialogOpen: PropTypes.func.isRequired,
};

export default CreateRental;
