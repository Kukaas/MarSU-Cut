import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { LoadingOutlined } from "@ant-design/icons";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CreateRentalSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { notification, Spin } from "antd";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

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
        "https://marsu.cut.server.kukaas.tech/api/v1/rental/create",
        {
          ...values,
          coordinatorEmail: currentUser.email,
          userId: currentUser._id,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        setLoading(false);
        form.reset();
        notification.success({
          message: "Rental submitted successfully",
          description: "Wait for the admin to approve your rental.",
          pauseOnHover: false,
          showProgress: true,
        });
      }
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Failed to submit order",
        description: "Please try again later.",
        pauseOnHover: false,
        showProgress: true,
      });
    }
  };

  return (
    <Spin
      spinning={loading}
      indicator={
        <LoadingOutlined
          className="dark:text-white"
          style={{
            fontSize: 48,
          }}
        />
      }
    >
      <div className="grid py-2">
        <div className="w-full">
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
                        placeholder="eg.Collge of Information Technology"
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
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="rentalDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Rental Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal w-full",
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
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Return Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal w-full",
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
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    variant="default"
                    className="w-full"
                  >
                    Submit Rental
                  </Button>
                </DialogTrigger>
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
                        setDialogOpen(false);
                      }}
                      className="m-2"
                      variant="default"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="loading-dots">Submitting Rental</span>
                      ) : (
                        "Submit Order"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </form>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default CreateRental;
