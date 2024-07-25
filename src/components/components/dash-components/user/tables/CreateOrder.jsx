import { Button } from "@/components/ui/button";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { app } from "@/firebase";
import { CreateOrderSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { message, notification, Progress } from "antd";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const CreateOrder = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: {
      studentNumber: "",
      studentName: "",
      studentGender: "",
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

  const handleCreateOrder = async (values) => {
    if (imageFileUrl === null) {
      message.error("Please fill all fields or the image is still uploading, please wait...");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "https://garments.kukaas.tech/api/v1/order/student/create",
        {
          ...values,
          receipt: imageFileUrl,
          userId: currentUser._id,
          studentEmail: currentUser.email,
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
          message: "Order submitted successfully",
          description: "Wait for the admin to schedule your measurement.",
          pauseOnHover: false,
          showProgress: true,
        });

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      setLoading(false);
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
            onSubmit={form.handleSubmit(handleCreateOrder)}
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
              name="studentGender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="block w-full text-start"
                          variant="outline"
                        >
                          {field.value || "Select Gender"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onSelect={() => field.onChange("Male")}
                        >
                          Male
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => field.onChange("Female")}
                        >
                          Female
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
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
                      handleCreateOrder(form.getValues());
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

export default CreateOrder;
