import { message, notification } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPasswordStart,
  forgotPasswordSuccess,
} from "../redux/forgotPassword/forgotPassword";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SHA256 } from "crypto-js";
import { useForm } from "react-hook-form";
import { OTPVerificationSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
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

const OTPVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { currentEmail } = useSelector((state) => state.forgotPasword);
  const { currentUser } = useSelector((state) => state.user);
  const hashedEmail = SHA256(currentEmail).toString();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (currentUser.isAdmin) {
      navigate("/dashboard?tab=home-admin");
    } else if (currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate(`/otp-verification/${hashedEmail}`);
    }
  }, [currentUser, navigate, hashedEmail]);

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
        "https://garments.kukaas.tech/api/v1/auth/send-otp",
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
        message.error(res.data.message);
      }
    } catch (error) {
      message.error(error.response.data.message);
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
    try {
      setLoading(true);
      if (!values.otp) return message.error("OTP is required");
      const res = await axios.post(
        "https://garments.kukaas.tech/api/v1/auth/verify-otp",
        { email: currentEmail, otp: values.otp },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setLoading(false);
        dispatch(forgotPasswordSuccess(currentEmail));
        message.success("OTP verified successfully");
        navigate(`/reset-password/${hashedEmail}`);
      } else {
        setLoading(false);
        message.error(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      message.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-[400px] mt-[120px]">
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
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One Time Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter OTP..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mt-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
              >
                {loading ? (
                  <span className="loading-dots">Verifying OTP</span>
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
    </div>
  );
};

export default OTPVerification;
