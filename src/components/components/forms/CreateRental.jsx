// UI
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
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DialogClose } from "@/components/ui/dialog";
import SelectField from "../custom-components/SelectField";
import { Input } from "@/components/ui/input";

// Utility function to determine stock color
const getStockColorClass = (quantity) => {
  if (quantity === 0) return "text-red-500";
  if (quantity < 15) return "text-orange-500";
  return "text-green-500";
};

const CreateRental = ({ onRentalCreated, setIsDialogOpen }) => {
  const [finishedProducts, setFinishedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const initialFormState = JSON.parse(
    localStorage.getItem("createRentalForm")
  ) || {
    coordinatorGender: "",
    department: "",
    possiblePickupDate: "",
    toga: {
      S14: 0,
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
      possiblePickupDate: new Date(),
      toga: {
        S14: 0,
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
        const res = await axios.get(`${BASE_URL}/api/v1/finished-product/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (res.status === 200) {
          // Filter and map to only include academic gown sizes and quantities
          const academicGowns = res.data.finishedProducts
            .filter((product) => product.productType === "ACADEMIC GOWN")
            .map(({ size, quantity }) => ({ size, quantity }));

          setFinishedProducts(academicGowns);
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
        setDialogOpen(false);
        form.reset();
        toast.success("Rental submitted successfully!", {
          description: "Wait for the admin to approve you rental",
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
                              format(field.value, "MMMM dd, yyy")
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

          {/* Rental Details SToga */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">Toga</legend>
            <div className="space-y-4">
              {["S14", "S16", "S17", "S18", "S19", "S20", "S20+"].map(
                (sizeKey) => {
                  const sizeName =
                    sizeKey.charAt(0).toUpperCase() + sizeKey.slice(1);
                  const maxQuantity =
                    finishedProducts.find(
                      (product) => product.size.toLowerCase() === sizeKey
                    )?.quantity || 0;
                  const colorClass = getStockColorClass(maxQuantity);

                  return (
                    <FormField
                      key={sizeKey}
                      control={form.control}
                      name={`toga.${sizeKey}`}
                      render={({ field }) => (
                        <FormItem className="">
                          <div className="flex items-center justify-between mb-2">
                            <FormLabel className="font-medium flex items-center ">
                              <span>{sizeName}</span>
                              <span
                                className={`px-2 py-1 text-xs ${colorClass} bg-opacity-10`}
                              >
                                {maxQuantity > 0
                                  ? `Available: ${maxQuantity}`
                                  : "Out of stock"}
                              </span>
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={
                                field.value !== undefined ? field.value : ""
                              }
                              placeholder={`Enter quantity for ${sizeName}`}
                              className="w-full rounded-md border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none p-2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                }
              )}
            </div>
          </fieldset>

          {/* Rental Details Hood */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">Hood</legend>
            <div className="space-y-4">
              <CustomInput
                form={form}
                name="hood"
                label="Hood"
                placeholder="Enter quantity for Hood"
                type="number"
              />
            </div>
          </fieldset>

          {/* Rental Details Cap */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">Cap</legend>
            <div className="space-y-4">
              {["M/L", "XL", "XXL"].map((sizeKey) => {
                const sizeName = sizeKey.toUpperCase();
                return (
                  <FormField
                    key={sizeKey}
                    control={form.control}
                    name={`cap.${sizeKey}`}
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="font-medium">
                          {sizeName}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value !== undefined ? field.value : ""}
                            placeholder={`Enter quantity for ${sizeName}`}
                            className="w-full rounded-md border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none p-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>
          </fieldset>

          {/* Rental Details Monaco Thread */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">Monaco Thread</legend>
            <div className="space-y-4">
              <CustomInput
                form={form}
                name="monacoThread"
                label="Monaco Thread"
                placeholder="Enter quantity for Monaco Thread"
                type="number"
              />
            </div>
          </fieldset>

          {/* Submission Section */}
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <div className="flex flex-col items-center gap-4 mt-4">
              <AlertDialogFooter className="w-full flex flex-col items-center gap-4">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      localStorage.removeItem("createRentalForm");
                    }}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <AlertDialogTrigger asChild>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="w-full flex items-center justify-center"
                  >
                    Submit Rental
                  </Button>
                </AlertDialogTrigger>
              </AlertDialogFooter>
            </div>

            <AlertDialogContent className="sm:max-w-[425px] mx-auto overflow-y-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                <AlertDialogDescription>
                  <div>
                    <p>Are you sure you want to submit these details?</p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col items-center gap-4 mt-4">
                <AlertDialogFooter className="w-full flex flex-col items-center gap-4">
                  <AlertDialogCancel asChild>
                    <Button variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </AlertDialogCancel>
                  <Button
                    onClick={() => {
                      handleCreateRental(form.getValues());
                    }}
                    variant="default"
                    disabled={loading}
                    className="w-full flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 animate-spin" />
                        <span>Submitting</span>
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </AlertDialogFooter>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    </div>
  );
};

CreateRental.propTypes = {
  onRentalCreated: PropTypes.func,
  setIsDialogOpen: PropTypes.func,
};

export default CreateRental;
