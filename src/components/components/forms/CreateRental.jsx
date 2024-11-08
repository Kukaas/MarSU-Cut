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
import CustomNumberInput from "../custom-components/CustomNumberInput";

const CreateRental = ({ onRentalCreated, setIsDialogOpen }) => {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const initialFormState = JSON.parse(
    localStorage.getItem("createRentalForm")
  ) || {
    coordinatorGender: "",
    department: "",
    possiblePickupDate: "",
    small: 0,
    medium: 0,
    large: 0,
    extraLarge: 0,
  };
  const [formState, setFormState] = useState(initialFormState);

  const form = useForm({
    resolver: zodResolver(CreateRentalSchema),
    defaultValues: { ...formState, coordinatorName: currentUser.name },
  });

  useEffect(() => {
    const formValues = form.watch((values) => {
      setFormState(values);
      localStorage.setItem("createRentalForm", JSON.stringify(values));
    });

    return () => formValues.unsubscribe();
  }, [form]);

  const departmentOptions = [
    "College of Engineering",
    "College of Industrial Technology",
    "College of Education",
    "College of Business Administration",
    "College of Arts and Sciences",
    "College of Information and Computing Sciences",
    "College of Allied Health and Medicine",
    "College of Governance",
  ];

  const handleCreateRental = async (values) => {
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
                  />
                )}
              />
            </div>
          </fieldset>

          {/* Rental Details Section */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">Rental Details</legend>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="possiblePickupDate"
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
                              <span>Pick your possible pickup date</span>
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
              <div className="flex justify-between gap-4">
                <CustomNumberInput
                  control={form.control}
                  label="Small"
                  name="small"
                  placeholder="Small"
                  type="number"
                />
                <CustomNumberInput
                  control={form.control}
                  label="Medium"
                  name="medium"
                  placeholder="Medium"
                  type="number"
                />
              </div>

              <div className="flex justify-between gap-4">
                <CustomNumberInput
                  control={form.control}
                  label="Large"
                  name="large"
                  placeholder="Large"
                  type="number"
                />
                <CustomNumberInput
                  control={form.control}
                  label="Extra Large"
                  name="extraLarge"
                  placeholder="Extra Large"
                  type="number"
                />
              </div>
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
