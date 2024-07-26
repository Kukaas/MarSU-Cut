import { message, notification } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  forgotPasswordFail,
  forgotPasswordSuccess,
} from "../redux/forgotPassword/forgotPassword";
import { useEffect, useState } from "react";
import { SHA512 } from "crypto-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/schema/shema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentEmail } = useSelector((state) => state.forgotPasword);
  const { currentUser } = useSelector((state) => state.user);
  const hashedEmail = SHA512(currentEmail).toString();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate(`/dashboard?tab=home-admin/${currentUser.token.substring(0, 25)}`);
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate(`/dashboard?tab=home/${currentUser.token.substring(0, 25)}`);
    } else {
      navigate(`/reset-password/${hashedEmail}`);
    }
  }, [currentUser, navigate, hashedEmail]);

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
      return message.error("Please fill in all fields");

    if (values.password !== values.confirmPassword)
      return message.error("Passwords do not match");

    if (values.password.length < 8)
      return message.error("Password must be at least 8 characters long");

    try {
      setLoading(true);
      const res = await axios.post(
        "https://garments.kukaas.tech/api/v1/auth/reset-password",
        { email: currentEmail, ...values },
        {
          headers: { "Content-Type": "application/json" },
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
      } else {
        setLoading(false);
        message.error(res.data.message);
        dispatch(forgotPasswordSuccess(currentEmail));
      }
    } catch (error) {
      setLoading(false);
      message.error(error.response.data.message);
      dispatch(forgotPasswordSuccess(currentEmail));
    }
  };

  return (
    <div className="min-h-[400px] mt-[100px] mb-5">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/* left */}
        <div className="flex-1 mb-4">
          <h1 className="font-bold text-4xl">
            Reset{" "}
            <span className="px-2 bg-gradient-to-r p-1 from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Password
            </span>
          </h1>
          <p className="text-l mt-4 text-gray-600">Enter your new password.</p>
        </div>
        {/* right */}
        <div className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleResetPassword)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password..."
                          {...field}
                        />
                        <button
                          onClick={toggleShowPassword}
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
              <Button
                type="submit"
                className="w-full mt-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
              >
                {loading ? (
                  <span className="loading-dots">Reseting Password</span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
