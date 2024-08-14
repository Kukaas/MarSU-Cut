// Ui import
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
import { toast, Toaster } from "sonner";

// Icons
import { Spin, notification } from "antd";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPasswordFail,
  forgotPasswordStart,
  forgotPasswordSuccess,
} from "../redux/forgotPassword/forgotPassword";

//Libraries
import axios from "axios";
import { SHA256 } from "crypto-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RequestResetPasswordSchema } from "@/schema/shema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RequestResetPassword = () => {
  const dispatch = useDispatch();
  const { loading1 } = useSelector((state) => state.forgotPassword) || {};
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(RequestResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle send OTP
  const handleSendOTP = async (values) => {
    // Hash email
    const hashedEmail = SHA256(values.email).toString();
    if (!values.email) return toast.error("Email is required");
    try {
      setLoading(true);
      dispatch(forgotPasswordStart());
      const res = await axios.post(
        "https://marsu.cut.server.kukaas.tech/api/v1/auth/send-otp",
        values,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setLoading(false);
        dispatch(forgotPasswordSuccess(values.email));
        notification.success({
          message: "Success",
          description: "An OTP has been sent to your email.",
          pauseOnHover: false,
          showProgress: true,
        });
        navigate(`/otp-verification/${hashedEmail}`);
      } else {
        setLoading(false);
        toast.error("Email is not registered", {
          description: "Please enter a valid email",
        });
        dispatch(forgotPasswordFail());
      }
    } catch (error) {
      setLoading(false);
      toast.error("Email is not registered", {
        description: "Please enter a valid email",
      });
      dispatch(forgotPasswordFail());
    }
  };

  return (
    <div className="min-h-[400px] mt-[140px]">
      {loading1 ? (
        <Spin spinning={loading1} />
      ) : (
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
          {/* left */}
          <div className="flex-1 mb-4">
            <h1 className="font-bold text-4xl">
              Password{" "}
              <span className=" bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Recovery
              </span>
            </h1>
            <p className="text-l mt-4">
              Enter your email to receive reset password instructions.
            </p>
          </div>
          {/* right */}
          <div className="flex-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSendOTP)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full mt-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 animate-spin" />
                      <span>Submitting</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Form>
            <div>
              <p className="text-center text-sm mt-3">
                Remembered your password?{" "}
                <Link to="/sign-in" className="text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-right" closeButton richColors />
    </div>
  );
};

export default RequestResetPassword;
