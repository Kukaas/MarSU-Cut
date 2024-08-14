import { Alert, Avatar, message, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { app } from "@/firebase";
import {
  logout,
  updateFail,
  updateStart,
  updateSuccess,
} from "@/redux/user/userSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { UpdateProfileSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SkeletonProfile from "../SkeletonProfile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChangePassword from "../forms/ChangePassword";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/lib/Toaster";
import { toast } from "sonner";

const DashProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=profile");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=profile");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const formUpdateProfile = useForm({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      photo: currentUser.photo,
      name: currentUser.name,
      email: currentUser.email,
    },
  });

  // Simulate a data fetch with a timeout
  useEffect(() => {
    setTimeout(() => {
      setSkeletonLoading(false);
    }, 4000);
  }, []);

  // Handle image upload
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

  // Upload image to Firebase Storage
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
    // eslint-disable-next-line
  }, [imageFile]);

  // Upload image to Firebase Storage
  const uploadImage = async () => {
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      () => {
        // Handle unsuccessful uploads
        setImageUploadError("Could not upload image. (Max size: 2MB)");
        setImageUploadProgress(null);
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

  // Update user profile
  const handleUpdate = async (values) => {
    try {
      setUpdateProfileLoading(true);
      dispatch(updateStart());

      if (imageFileUrl) {
        values.photo = imageFileUrl;
      }
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/user/update/${currentUser?._id}`,
        values,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const data = res.data;

      if (res.status === 200) {
        setUpdateProfileLoading(false);
        dispatch(updateSuccess(data));
        toast.success("Profile updated successfully");
        // Reset the form with updated values
        formUpdateProfile.reset();
        setImageUploadProgress(false);
      }
    } catch (error) {
      dispatch(updateFail());
      setUpdateProfileLoading(false);
      Toaster();
    }
  };

  // Delete user account
  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `https://marsu.cut.server.kukaas.tech/api/v1/user/delete/${currentUser?._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setLoading(false);
        dispatch(logout());
        message.success("Account deleted successfully");
        message.info("Thank you for using our service. Come back soon!");
        navigate("/sign-in");
        // Delete the image from Firebase Storage
        const storage = getStorage();
        const imageRef = ref(storage, imageFileUrl);
        deleteObject(imageRef)
          .then(() => {
            console.log("Image deleted from Firebase Storage");
          })
          .catch((error) => {
            console.error(
              "Failed to delete image from Firebase Storage",
              error
            );
          });
      }
    } catch (error) {
      setLoading(false);
      Toaster();
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full max-h-screen">
      <Helmet>
        <title>MarSU Cut | Profile</title>
        <meta name="description" content="" />
      </Helmet>
      {skeletonLoading ? (
        <div className="flex justify-center items-start pt-20 h-screen">
          <SkeletonProfile />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-screen mt-3">
          <Form {...formUpdateProfile}>
            <form
              onSubmit={formUpdateProfile.handleSubmit(handleUpdate)}
              className="space-y-4 w-full p-3"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={filePickerRef}
                style={{ display: "none" }}
              />
              <div
                className="relative w-32 h-32 m-auto self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                onClick={() =>
                  filePickerRef.current && filePickerRef.current.click()
                }
              >
                <Avatar
                  src={imageFileUrl || currentUser.photo}
                  alt={currentUser ? currentUser.name : "User"}
                  className={`w-full rounded-full h-full border-8 border-[lightgray] object-cover ${
                    imageUploadProgress &&
                    imageUploadError < 100 &&
                    "opacity-50"
                  }`}
                />
                {imageUploadProgress && (
                  <CircularProgressbar
                    value={imageUploadProgress || 0}
                    text={`${imageUploadProgress}%`}
                    strokeWidth={5}
                    styles={{
                      root: {
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      },
                      path: {
                        stroke: `rgba(62, 152, 199, ${
                          imageUploadProgress / 100
                        })`,
                      },
                    }}
                  />
                )}
              </div>
              {imageUploadError && (
                <Alert message={imageUploadError} type="error" />
              )}
              <FormField
                control={formUpdateProfile.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formUpdateProfile.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={updateProfileLoading}
              >
                {updateProfileLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 animate-spin" />
                    <span>Updating Profile</span>
                  </div>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
            <div className="w-full p-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full">
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your new password
                    </DialogDescription>
                    <ChangePassword />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <div className="w-full p-3 mb-[80px]">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete Account?</DialogTitle>
                    <DialogDescription>
                      All of your data will be deleted. Click Ok to proceed
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end">
                    <DialogClose>
                      <Button variant="secondary" className="m-2">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={() => handleDeleteUser()}
                      className="m-2"
                      variant="destructive"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 animate-spin" />
                          <span>Deleting Account</span>
                        </div>
                      ) : (
                        "Delete Account"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default DashProfile;
