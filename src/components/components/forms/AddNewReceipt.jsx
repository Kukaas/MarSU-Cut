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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Progress } from "antd";

// firebase
import { app } from "@/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

// others
import { CreateOrderSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon, Loader2, UploadIcon } from "lucide-react";
import ToasterError from "@/lib/Toaster";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomInput from "../custom-components/CustomInput";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { AlertDialogCancel } from "@/components/ui/alert-dialog";
import SelectField from "../custom-components/SelectField";

const AddNewReceipt = ({ orderId }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: {
      receipt: "",
      url: "",
      receiptType: "",
      ORNumber: "",
      amount: 0,
      datePaid: "",
    },
  });

  // Function to handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file size exceeds 2MB
      if (file.size > 2 * 1024 * 1024) {
        // Display notification
        toast.error("File too large!", {
          description: "File should not exceeds 2MB.",
          action: {
            label: "Ok",
          },
        });
        return; // Stop the function if file is too large
      }
      // Create a URL for the image
      const imageUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImageFileUrl(imageUrl);
    }
  };

  // Function to upload image to Firebase Storage
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
    // eslint-disable-next-line
  }, [imageFile]);

  // Function to upload image to Firebase Storage
  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      () => {
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
  };

  const handleCreateOrder = async (values, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (imageFileUrl === null) {
      toast.error("Please wait for the image to upload.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/order//student/receipt/${orderId}`,
        {
          url: imageFileUrl,
          type: values.type,
          ORNumber: values.ORNumber,
          amount: values.amount,
          datePaid: values.datePaid,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setProgress(0);
        setLoading(false);

        form.reset();
        toast.success("Order submitted successfully!");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          toast.error(data.message);
        }
      }
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateOrder)}
          className="space-y-1 w-full"
        >
          <CustomInput
            form={form}
            name="ORNumber"
            label="OR Number"
            placeholder="eg. 123456"
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <SelectField
                field={field}
                label="Receipt Type"
                options={["Full Payment", "Partial Payment"]}
                placeholder="Select Receipt Type"
              />
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value !== undefined ? field.value : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value !== "" ? parseFloat(value) : undefined
                      );
                    }}
                    placeholder="Amount"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-4 mt-4">
            <FormField
              control={form.control}
              name="datePaid"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Date Paid</FormLabel>
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
                          {field.value
                            ? format(new Date(field.value), "MMMM dd")
                            : "Select Date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : null}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="url"
            render={() => (
              <FormItem>
                <FormLabel>Upload Receipt</FormLabel>
                <FormControl>
                  <div>
                    <div className="flex items-center relative justify-between">
                      {imageFileUrl ? (
                        <img
                          src={imageFileUrl}
                          alt="receipt"
                          className="h-8 w-8 absolute ml-5"
                        />
                      ) : (
                        <UploadIcon className="h-5 w-5 absolute ml-5" />
                      )}
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="w-full flex justify-start"
                        variant="outline"
                      >
                        <span className="truncate ml-12">
                          {" "}
                          {imageFile
                            ? imageFile.name.slice(0, 20) + "..."
                            : "Upload Receipt"}{" "}
                        </span>
                      </Button>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleImageChange(e);
                        // Field value will be set after upload is complete
                      }}
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col">
            <p className="text-sm text-red-500 mt-2">
              <i>Note: Wait for the upload to reach 100%</i>
            </p>
            <Progress
              percent={progress}
              status="active"
              strokeColor={{
                from: "#108ee9",
                to: "#87d068",
              }}
              format={(percent) => (
                <span className="dark:text-white">{percent}%</span>
              )}
            />
          </div>
          <Dialog>
            <div className="flex items-center justify-end gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <DialogTrigger asChild>
                <Button variant="default">Submit Order</Button>
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
                  onClick={(event) => {
                    handleCreateOrder(form.getValues(), event);
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
                    "Submit Order"
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

AddNewReceipt.propTypes = {
  orderId: PropTypes.string,
};

export default AddNewReceipt;
