// Ui import
import { toast, Toaster } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

// icon
import { message, notification } from "antd";
import { Loader2 } from "lucide-react";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPasswordStart,
  forgotPasswordSuccess,
} from "../redux/forgotPassword/forgotPassword";

// Libraries
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { OTPVerificationSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/api";
import CustomInput from "@/components/components/CustomInput";

const OTPVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { currentEmail } = useSelector((state) => state.forgotPasword);

  // Redirect to forgot password page if email is not available
  useEffect(() => {
    if (!currentEmail) {
      navigate("/forgot-password");
    }
  }, [currentEmail, navigate]);

  const form = useForm({
    resolver: zodResolver(OTPVerificationSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Get the initial value of resendLoading and countdown from local storage
  useEffect(() => {
    const initialResendLoading =
      JSON.parse(localStorage.getItem("resendLoading")) || false;
    const initialCountdown =
      JSON.parse(localStorage.getItem("countdown")) || 60;
    setResendLoading(initialResendLoading);
    setCountdown(initialCountdown);
  }, []);

  // Save resendLoading and countdown to local storage
  useEffect(() => {
    localStorage.setItem("resendLoading", JSON.stringify(resendLoading));
    localStorage.setItem("countdown", JSON.stringify(countdown));
  }, [resendLoading, countdown]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (resendLoading) {
      // Start countdown timer when resendLoading is true
      interval = setInterval(() => {
        setCountdown((seconds) => {
          if (seconds > 0) {
            return seconds - 1;
          } else {
            // Remove items from local storage when countdown reaches 0
            localStorage.removeItem("resendLoading");
            localStorage.removeItem("countdown");
            // Set resendLoading to false when countdown reaches 0
            setResendLoading(false);
            return 0;
          }
        });
      }, 1000);
    } else if (!resendLoading && countdown !== 60) {
      setCountdown(60);
    }
    return () => clearInterval(interval);
  }, [resendLoading, countdown]);

  // Resend OTP
  const resendOTP = async () => {
    if (!currentEmail) return navigate("/forgot-password");
    try {
      dispatch(forgotPasswordStart());
      const res = await axios.post(
        `${BASE_URL}/api/v1/auth/send-otp`,
        { email: currentEmail },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        notification.success({
          message: "Success",
          description: "An OTP has been sent to your email.",
          pauseOnHover: false,
          showProgress: true,
        });
        dispatch(forgotPasswordSuccess(currentEmail));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Handle resend OTP button click event and set resendLoading to true for 60 seconds
  const handleResendOTP = async () => {
    setResendLoading(true);
    await resendOTP();
    setTimeout(() => {
      setResendLoading(false);
    }, 60000);
  };

  // Handle OTP verification
  const handleSubmitOTP = async (values) => {
    const generateRandomToken = (length) => {
      let result = "";
      while (result.length < length) {
        result += Math.random().toString(36).substring(2); // Concatenate random strings
      }
      return result.substring(0, length); // Truncate to the desired length
    };

    const token = generateRandomToken(50);

    try {
      setLoading(true);
      if (!values.otp) {
        setLoading(false);
        return toast.error("OTP is required", {
          description: "Please enter the OTP sent to your email.",
        });
      }
      const res = await axios.post(
        "https://marsu.cut.server.kukaas.tech/api/v1/auth/verify-otp",
        { email: currentEmail, otp: values.otp },
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
        dispatch(forgotPasswordSuccess(currentEmail));
        message.success("OTP verified successfully");
        navigate(`/reset-password/${token}`, {
          replace: true,
        });
      } else {
        setLoading(false);
        toast.error(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-[450px] mt-[140px]">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/* left */}
        <div className="flex-1 mb-4">
          <h1 className="font-bold text-4xl">
            OTP{" "}
            <span className="px-2 bg-gradient-to-r p-1 from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Verification
            </span>
          </h1>
          <p className="text-l mt-4 ">Enter the OTP sent to your email.</p>
        </div>
        {/* right */}
        <div className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitOTP)}
              className="space-y-4"
            >
              <CustomInput
                form={form}
                name="otp"
                label="OTP"
                placeholder="Enter OTP..."
                maxLength={4}
              />
              <Button
                type="submit"
                className="w-full mt-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 animate-spin" />
                    <span>Verifying OTP</span>
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </form>
          </Form>
          <div>
            <p className="text-center text-sm mt-3">
              Didn&apos;t receive the OTP?{" "}
              <span
                className={`text-blue-500 cursor-pointer ${
                  resendLoading && countdown > 0 ? "opacity-50" : ""
                }`}
                onClick={
                  !(resendLoading && countdown > 0)
                    ? handleResendOTP
                    : undefined
                }
              >
                {resendLoading
                  ? countdown > 0
                    ? `Resend in ${countdown}s`
                    : "Resend OTP"
                  : "Resend OTP"}
              </span>
            </p>
          </div>
        </div>
      </div>
      <Toaster position="top-center" closeButton richColors />
    </div>
  );
};

export default OTPVerification;
