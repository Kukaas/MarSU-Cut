import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { app } from "@/firebase";
import { cn } from "@/lib/utils";
import { CreateRentalSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { message, notification, Progress } from "antd";
import axios from "axios";
import { format } from "date-fns";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const CreateRental = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(CreateRentalSchema),
    defaultValues: {
      studentNumber: "",
      studentName: "",
      studentGender: "",
      rentalDate: "",
      returnDate: "",
      receipt: "",
    },
  });

  // Function to handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file size exceeds 2MB
      if (file.size > 2 * 1024 * 1024) {
        // Display notification
        notification.error({
          message: "File too large",
          description: "The file size exceeds the maximum limit of 2MB.",
        });
        return; // Stop the function if file is too large
      }
      const imageUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImageFileUrl(imageUrl);
    }
  };

  // Function to handle image upload
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

  const handleCreateRental = async (values) => {
    if (imageFileUrl === null) {
      message.error(
        "Please fill all fields or image is still uploading, please wait..."
      );
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "https://garments.kukaas.tech/api/v1/rental/create",
        {
          ...values,
          receipt: imageFileUrl,
          studentEmail: currentUser.email,
          userId: currentUser._id,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        setProgress(0);
        setLoading(false);
        form.reset();
        notification.success({
          message: "Rental submitted successfully",
          description: "Wait for the admin to approve your rental.",
          pauseOnHover: false,
          showProgress: true,
        });

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setLoading(false);
        notification.error({
          message: "Failed to submit rental",
          description: "Please try again later.",
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
    <div className="grid gap-4 py-4">
      <div className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateRental)}
            className="space-y-1 w-full"
          >
            <FormField
              control={form.control}
              name="studentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="eg.21B994" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="eg.Jhon Doe" />
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
                <FormItem className="flex flex-col">
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
            <FormField
              control={form.control}
              name="receipt"
              render={() => (
                <FormItem>
                  <FormLabel>Upload Receipt</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleImageChange(e);
                        // Field value will be set after upload is complete
                      }}
                      className="block w-full text-sm text-gray-500"
                      ref={fileInputRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant="default"
                  className="w-full"
                >
                  Submit Order
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
                  >
                    {loading ? (
                      <span className="loading-dots">Submitting Order</span>
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
  );
};

export default CreateRental;
