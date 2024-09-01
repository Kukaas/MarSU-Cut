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
import { useSelector } from "react-redux";
import { Loader2, UploadIcon } from "lucide-react";
import ToasterError from "@/lib/Toaster";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomInput from "../CustomInput";
import SelectField from "../SelectField";

const CreateOrder = ({ addNewOrder }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
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
      toast.error(
        "Please fill all fields or the image is still uploading, please wait..."
      );
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/order/student/create`,
        {
          ...values,
          receipt: imageFileUrl,
          userId: currentUser._id,
          studentEmail: currentUser.email,
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
        setProgress(0);
        setLoading(false);
        addNewOrder(res.data.order);
        form.reset();
        toast.success("Order submitted successfully!", {
          description: "Please wait for the admin to approve your order.",
        });

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      setLoading(false);
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
            name="studentNumber"
            label="Student Number"
            placeholder="eg. 21B12345"
          />
          <CustomInput
            form={form}
            name="studentName"
            label="Student Name"
            placeholder="eg. John Doe"
          />
          <FormField
            control={form.control}
            name="studentGender"
            render={({ field }) => (
              <SelectField
                field={field}
                label="Gender"
                options={["Male", "Female"]}
                placeholder="Select gender"
              />
            )}
          />
          <FormField
            control={form.control}
            name="receipt"
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
              <DialogTrigger asChild>
                <Button variant="default" className="mt-2">
                  Submit Order
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

CreateOrder.propTypes = {
  addNewOrder: PropTypes.func,
};

export default CreateOrder;
