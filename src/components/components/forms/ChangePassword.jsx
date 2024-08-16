// UI
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { message } from "antd";

// icons
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";

// others
import { ResetPasswordSchemaProfile } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { token } from "@/lib/token";

const ChangePassword = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const formChangePassword = useForm({
    resolver: zodResolver(ResetPasswordSchemaProfile),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const toggleShowPassword = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const toggleShowOldPassword = () => {
    setShowOldPassword((prev) => !prev);
  };

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please check you password and confirm password",
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/user/update/password/${currentUser?._id}`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success("Password changed successfully");
        formChangePassword.reset();
        setLoading(false);
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("Old password does not match", {
          description: "Please input your old password.",
        });
      }

      if (error.response.status === 500) {
        message.error("Internal server error");
      }
      setLoading(false);
    }
  };

  return (
    <Form {...formChangePassword}>
      <form
        onSubmit={formChangePassword.handleSubmit(handleChangePassword)}
        className="space-y-4 w-full p-3"
      >
        <FormField
          control={formChangePassword.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Enter your old password..."
                    {...field}
                  />
                  <button
                    onClick={toggleShowOldPassword}
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showOldPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formChangePassword.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password..."
                    {...field}
                  />
                  <button
                    onClick={toggleShowPassword}
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formChangePassword.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password..."
                    {...field}
                  />
                  <button
                    onClick={toggleShowConfirmPassword}
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => formChangePassword.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 animate-spin" />
                <span>Changing Password</span>
              </div>
            ) : (
              "Change Password"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChangePassword;
