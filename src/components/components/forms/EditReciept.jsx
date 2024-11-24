import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { editReceiptSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import CustomInput from "../custom-components/CustomInput";
import SelectField from "../custom-components/SelectField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UploadIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Progress } from "antd";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/firebase";
import { ref } from "firebase/storage";
import axios from "axios";
import { token } from "@/lib/token";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/api";

const EditReciept = ({ selectedReceipt, orderId, updateReceipt }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(selectedReceipt.url);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(editReceiptSchema),
    defaultValues: {
      ORNumber: selectedReceipt.ORNumber,
      amount: selectedReceipt.amount, // Set default value for 'amount'
      type: selectedReceipt.type || "Down Payment",
      datePaid: selectedReceipt.datePaid,
      url: selectedReceipt.url,
    },
  });

  const { watch, setValue } = form;
  const receiptType = watch("type"); // Watch for changes to receipt type

  // Ensure that the amount field is set to the default value or cleared based on receiptType
  useEffect(() => {
    if (receiptType === "Full Payment") {
      setValue("amount", selectedReceipt.amount); // Set the amount when "Full Payment"
    } else {
      setValue("amount", ""); // Clear the amount if it's not "Full Payment"
    }
  }, [receiptType, selectedReceipt, setValue]);

  // Function to handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
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

  const handleEditReceipt = async (values) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/order/student/receipt/${orderId}/${selectedReceipt._id}`,
        {
          ...values,
          url: imageFileUrl,
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
        toast.success("Receipt edited successfully!", {
          description: "The receipt has been updated.",
        });
        updateReceipt(res.data.order);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error editing receipt:", error);
      // Display notification
      toast.error("Error editing receipt!", {
        description: "An error occurred while updating the receipt.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      {selectedReceipt && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEditReceipt)}>
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
                  onChange={(value) => {
                    field.onChange(value); // Update form state
                  }}
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
                        field.onChange(value !== "" ? parseFloat(value) : "");
                      }}
                      placeholder={selectedReceipt.amount}
                      className="w-full"
                      disabled={receiptType === "Full Payment"} // Disable if Full Payment
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
                              ? format(new Date(field.value), "MMMM dd, yyy")
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
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
                        onChange={handleImageChange}
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
            <AlertDialogFooter>
              <div className="flex justify-between gap-2 mt-5 w-full">
                <AlertDialogCancel asChild>
                  <Button variant="secondary" className="w-full">
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  loading={loading}
                >
                  Save Changes
                </Button>
              </div>
            </AlertDialogFooter>
          </form>
        </Form>
      )}
    </div>
  );
};

export default EditReciept;
