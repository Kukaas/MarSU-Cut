import { Button } from "@/components/ui/button";
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
import { message, Modal, notification, Progress } from "antd";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const CreateOrder = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  const form = useForm({
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: {
      studentNumber: "",
      studentName: "",
      studentGender: "",
      studentPhone: "",
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

  // Function to handle form submission
  const handleCreateOrder = async (values) => {
    const submitForm = async () => {
      if (imageFileUrl === null) {
        message.error("Image is still uploading, please wait...");
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
          notification.success({
            message: "Order submitted successfully",
            description: "Wait for the admin to schedule your measurement.",
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
    // Function to convert camelCase or snake_case to a more readable format
    const formatKey = (key) => {
      // Convert snake_case to camelCase
      let formattedKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      // Break camelCase and add spaces
      formattedKey = formattedKey.replace(/([A-Z])/g, " $1");
      // Capitalize the first letter of each word
      return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
    };

    // Function to check if a string is a valid URL
    const isUrl = (value) => {
      try {
        new URL(value);
        return true;
      } catch (_) {
        return false;
      }
    };

    // Display form details in a modal
    const formDetailsElements = Object.entries(values).map(([key, value]) => (
      <div key={key} style={{ marginBottom: "10px", fontSize: "16px" }}>
        {formatKey(key)}:{" "}
        {key === "receipt" && isUrl(imageFileUrl) ? ( // Check if 'receipt' and imageFileUrl is a valid URL
          <a
            href={imageFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: "bold" }}
          >
            View Image
          </a>
        ) : (
          <strong>{value}</strong>
        )}
      </div>
    ));

    // Display a modal to confirm form submission
    Modal.confirm({
      title: "Confirm Submission",
      content: (
        <div style={{ fontSize: "16px" }}>
          <p>Are you sure you want to submit these details?</p>
          <p style={{ marginBottom: "20px", color: "red" }}>
            Once you submit you can&apos;t change the details.
          </p>
          {formDetailsElements}
        </div>
      ),
      onOk() {
        submitForm();
      },
      onCancel() {},
    });
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
            <Button type="submit" className="w-full">
              {loading ? (
                <span className="loading-dots">Submitting Order</span>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateOrder;
