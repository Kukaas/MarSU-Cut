// UI
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { message } from "antd";

// icons
import { Loader2 } from "lucide-react";

// others
import { ResetPasswordSchemaProfile } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomInput from "../custom-components/CustomInput";

const ChangePassword = () => {
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
        `${BASE_URL}/api/v1/user/update/password/${currentUser?._id}`,
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
        <CustomInput
          form={formChangePassword}
          name="oldPassword"
          type="password"
          placeholder="Enter your old password..."
          label="Old Password"
        />

        <CustomInput
          form={formChangePassword}
          name="newPassword"
          type="password"
          placeholder="Enter your new password..."
          label="New Password"
        />
        <CustomInput
          form={formChangePassword}
          name="confirmPassword"
          type="password"
          placeholder="Confirm your new password..."
          label="Confirm Password"
        />
        <div className="flex items-center justify-end">
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
