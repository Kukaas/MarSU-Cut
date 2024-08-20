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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { CalendarIcon, Loader2 } from "lucide-react";

// others
import { cn } from "@/lib/utils";
import { CreateRentalSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ToasterError from "@/lib/Toaster";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";

const CreateRental = () => {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const form = useForm({
    resolver: zodResolver(CreateRentalSchema),
    defaultValues: {
      idNumber: "",
      coordinatorName: "",
      coordinatorGender: "",
      department: "",
      rentalDate: "",
      returnDate: "",
      quantity: 0,
    },
  });

  const handleCreateRental = async (values) => {
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
      }
    } catch (error) {
      setLoading(false);
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    }
  };

  return (
    <div className="grid gap-2 py-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateRental)}
          className="space-y-1 w-full"
        >
          <FormField
            control={form.control}
            name="idNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="eg.21B994" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coordinatorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coordinator Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="eg.Jhon Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="eg.College of Information Technology"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value !== undefined ? field.value : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value !== "" ? parseFloat(value) : "");
                    }}
                    placeholder="Quantity"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rentalDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Rental Date</FormLabel>
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
                          <span>Pick a rental date</span>
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
          <FormField
            control={form.control}
            name="returnDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Return Date</FormLabel>
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
                          <span>Pick a return date</span>
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <div className="flex items-center justify-end gap-2">
              <DialogTrigger asChild>
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant="default"
                  className="mt-2"
                >
                  Submit Rental
                </Button>
              </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-[425px] mx-auto">
              <DialogHeader>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogDescription>
                  <div>
                    <p>Are you sure you want to submit these details?</p>
                    <p className="mb-5 text-red-500">
                      Once you submit you can&apos;t change the details.
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end">
                <DialogClose asChild>
                  <Button variant="outline" className="m-2">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    handleCreateRental(form.getValues());
                  }}
                  className="m-2"
                  variant="default"
                  disabled={loading}
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
              </div>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  );
};

export default CreateRental;
