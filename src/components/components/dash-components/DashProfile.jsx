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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, Avatar, message, notification, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "sonner";

// firebase
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/firebase";

import {
  logout,
  updateFail,
  updateStart,
  updateSuccess,
} from "@/redux/user/userSlice";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// others
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UpdateProfileSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";

import { Helmet } from "react-helmet";
import { Camera, Loader2 } from "lucide-react";

import SkeletonProfile from "../SkeletonProfile";
import ChangePassword from "../forms/ChangePassword";
import ToasterError from "@/lib/Toaster";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
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
    } else {
      setImageFile(null);
      setImageFileUrl(null);
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
        `${BASE_URL}/api/v1/user/update/${currentUser?._id}`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const data = res.data;

      if (res.status === 200) {
        setUpdateProfileLoading(false);
        dispatch(updateSuccess(data));
        toast.success("Profile updated successfully");
        setImageUploadProgress(false);
      }
    } catch (error) {
      dispatch(updateFail());
      setUpdateProfileLoading(false);
      ToasterError();
    }
  };

  // Delete user account
  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/user/delete/${currentUser?._id}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
      ToasterError();
    }
  };

  return (
    <div className="p-5 h-screen w-full">
      <Typography.Title level={2} className="text-black dark:text-white">
        Profile
      </Typography.Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Helmet>
          <title>MarSU Cut | Profile</title>
          <meta name="description" content="" />
        </Helmet>
        <div className="p-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <Separator />
            {skeletonLoading ? (
              <SkeletonProfile />
            ) : (
              <CardContent>
                <Form {...formUpdateProfile}>
                  <form
                    onSubmit={formUpdateProfile.handleSubmit(handleUpdate)}
                    className="space-y-4 w-full p-3"
                  >
                    <div className="flex items-center justify-center gap-5 mt-4">
                      <div className="flex flex-col items-center">
                        <div className="relative w-20 h-20 mt-3 cursor-default shadow-md overflow-hidden rounded-full">
                          <Avatar
                            src={imageFileUrl || currentUser.photo}
                            alt={currentUser ? currentUser.name : "User"}
                            className={`w-full rounded-full h-full border-7 border-[lightgray] object-cover ${
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
                      </div>
                      <div
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer h-[200px] sm:h-[150px] md:h-[100px] flex flex-col justify-center items-center space-y-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300"
                        onClick={() =>
                          filePickerRef.current && filePickerRef.current.click()
                        }
                        onDragOver={(e) => e.preventDefault()} // Allow the element to accept the drop
                        onDrop={(e) => {
                          e.preventDefault(); // Prevent default behavior (open as link for some elements)
                          handleImageChange(e); // Handle file drop
                        }}
                      >
                        <Camera className="w-8 h-8 mx-auto text-gray-400 sm:w-6 sm:h-6 md:w-4 md:h-4" />
                        <p className="text-blue-600 underline text-sm sm:text-xs md:text-[10px]">
                          Click to upload
                        </p>
                        <p className="text-sm text-gray-500 sm:text-xs md:text-[10px]">
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 sm:text-[10px] md:text-[9px]">
                          PNG, JPG
                        </p>
                        <p className="text-xs text-gray-400 sm:text-[10px] md:text-[9px]">
                          Max size: 2MB
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          ref={filePickerRef}
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
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
                            All of your data will be deleted. Click Ok to
                            proceed.
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
                  </form>
                </Form>
              </CardContent>
            )}
          </Card>
        </div>
        <div className="p-2">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent>
              <ChangePassword />
            </CardContent>
          </Card>
        </div>
        <Toaster position="top-center" richColors closeButton />
      </div>
    </div>
  );
};

export default DashProfile;
