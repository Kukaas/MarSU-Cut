import { Form, FormField } from "@/components/ui/form";
import { app } from "@/firebase";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import {
  logout,
  updateFail,
  updateStart,
  updateSuccess,
} from "@/redux/user/userSlice";
import { CoordinatorUpdateProfileSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Avatar, message } from "antd";
import axios from "axios";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Camera, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import CustomInput from "../../custom-components/CustomInput";
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
import { useNavigate } from "react-router-dom";
import SelectField from "../../custom-components/SelectField";
import ToasterError from "@/lib/Toaster";

const CoordinatorProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const formUpdateProfile = useForm({
    resolver: zodResolver(CoordinatorUpdateProfileSchema),
    defaultValues: {
      photo: currentUser.photo,
      name: currentUser.name,
      email: currentUser.email,
      gender: currentUser.gender,
      department: currentUser.department,
    },
  });

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (file) {
      // Check if file size exceeds 2MB
      if (file.size > 2 * 1024 * 1024) {
        // Display notification
        setImageUploadError("Image size is too large. (Max size: 2MB)");
        toast.error("Image size is too large. (Max size: 2MB)");
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
        { ...values, role: "Coordinator" },
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
        dispatch(updateSuccess(data));
        toast.success("Profile updated successfully");
        setImageUploadProgress(false);
      }
    } catch (error) {
      dispatch(updateFail());
      if (error.response) {
        ToasterError({ description: error.response.data.message });
      } else {
        ToasterError({
          description: "Failed to update profile. Please try again.",
        });
      }
    } finally {
      setUpdateProfileLoading(false);
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
      ToasterError({
        description: "Failed to delete account. Please try again.",
      });
    }
  };
  return (
    <div>
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
          <div className="flex justify-between items-center gap-5 mt-4">
            <CustomInput
              form={formUpdateProfile}
              name="name"
              label="Name"
              type="text"
            />
            <div className="flex-1">
              <FormField
                control={formUpdateProfile.control}
                name="gender"
                render={({ field }) => (
                  <SelectField
                    field={field}
                    label="Gender"
                    options={["Male", "Female"]}
                    placeholder="Gender"
                  />
                )}
              />
            </div>
          </div>
          <FormField
            control={formUpdateProfile.control}
            name="department"
            render={({ field }) => (
              <SelectField
                field={field}
                label="Department"
                options={[
                  "College of Engineering",
                  "College of Industrial Technology",
                  "College of Education",
                  "College of Business Administration",
                  "College of Arts and Sciences",
                  "College of Information and Computing Sciences",
                  "College of Allied Health and Medicine",
                  "College of Governance",
                ]}
                placeholder="Department"
              />
            )}
          />
          <CustomInput
            form={formUpdateProfile}
            name="email"
            label="Email"
            type="disabled"
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
                  All of your data will be deleted. Click Ok to proceed.
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
    </div>
  );
};

export default CoordinatorProfile;
