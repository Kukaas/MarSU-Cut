// UI
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { notification } from "antd";

// icons
import { Loader2 } from "lucide-react";

// redux
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  forgotPasswordFail,
  forgotPasswordSuccess,
} from "../redux/forgotPassword/forgotPassword";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/schema/shema";
import { BASE_URL } from "@/lib/api";
import CustomInput from "@/components/components/custom-components/CustomInput";
import LeftSideDescription from "@/components/components/custom-components/LeftSideDescription";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { currentEmail } = useSelector((state) => state.forgotPasword);

  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Redirect to forgot password page if email is not available
  useEffect(() => {
    if (!currentEmail) {
      navigate("/forgot-password");
    }
  }, [currentEmail, navigate]);

  // Handle reset password
  const handleResetPassword = async (values) => {
    if (!currentEmail) return navigate("/forgot-password");

    if (!values.password || !values.confirmPassword)
      return toast.error("Please fill in all fields");

    if (values.password !== values.confirmPassword)
      return toast.error("Passwords do not match", {
        description: "Please check your password",
      });

    if (values.password.length < 8)
      return toast.error("Password must be at least 8 characters long");

    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/auth/reset-password`,
        { email: currentEmail, ...values },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setLoading(false);
        notification.success({
          message: "Success",
          description: "Password reset successful. You can now sign in.",
          pauseOnHover: false,
          showProgress: true,
        });
        dispatch(forgotPasswordFail());
        navigate("/sign-in");
        localStorage.removeItem("token");
      } else {
        setLoading(false);
        toast.error(res.data.message);
        dispatch(forgotPasswordSuccess(currentEmail));
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
      dispatch(forgotPasswordSuccess(currentEmail));
    }
  };

  return (
    <div className="min-h-[400px] mt-[100px] mb-5">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/* left */}
        <LeftSideDescription black="Reset " gradient="Password" description="Reset your password" />
        {/* right */}
        <div className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleResetPassword)}
              className="space-y-4"
            >
              <CustomInput
                form={form}
                name="password"
                label="Password"
                placeholder="Enter your new password..."
                type="password"
              />
              <CustomInput
                form={form}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your new password..."
                type="password"
              />
              <Button
                type="submit"
                className="w-full mt-3 rounded-lg text-white text-lg"
                style={{
                  background:
                    "linear-gradient(90deg, hsla(48, 80%, 66%, 1) 0%, hsla(0, 100%, 25%, 1) 100%)",
                }}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 animate-spin" />
                    <span>Reseting Password</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Toaster position="top-center" closeButton richColors />
    </div>
  );
};

export default ResetPassword;
