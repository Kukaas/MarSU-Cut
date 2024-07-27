import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterSchema } from "@/schema/shema";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { message, notification } from "antd";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useSelector } from "react-redux";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!currentUser || !currentUser.token) {
      navigate("/sign-up");
      return;
    }
    const token = currentUser.token;
    const parts = token.split(".");
    const url = parts[2];
    if (currentUser && currentUser.isAdmin) {
      navigate(`dashboard?tab=home-admin/${url}`);
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate(`dashboard?tab=home/${url}`);
    } else {
      navigate("/sign-up");
    }
  }, [currentUser, navigate]);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle register
  const handleRegister = async (values) => {
    if (values.email && values.email.includes(" ")) {
      message.error("Email cannot contain spaces");
      return;
    }

    if (values.password && values.password.includes(" ")) {
      message.error("Password cannot contain spaces");
      return;
    }

    if (values.password && values.password.length < 6) {
      message.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    if (
      !values.name ||
      !values.email ||
      !values.password ||
      !values.confirmPassword
    ) {
      message.error("Please fill out all fields");
      setLoading(false);
      return;
    }

    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(
        "https://garments.kukaas.tech/api/v1/auth/sign-up",
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200) {
        notification.success({
          message: "Success",
          description: "An email has been sent to you for verification.",
          pauseOnHover: false,
          showProgress: true,
        });
        navigate("/sign-in");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setLoading(false);
        message.error("Email is already taken");
      } else if (error.response && error.response.status === 401) {
        setLoading(false);
        message.error("Name already taken");
      } else {
        setLoading(false);
        message.error("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[500px] mt-[50px] mb-8">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/* left */}
        <div className="flex-1 mb-4">
          <Link to="/" className="font-bold hover:text-current text-4xl ">
            <div className="flex flex-col items-start">
              Welcome to
              <span className="px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white p-1 mt-1">
                MSC Garments
              </span>
            </div>
          </Link>
          <p className="text-l mt-4">Sign up with your email.</p>
        </div>
        {/* right */}
        <div className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleRegister)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
                  <span className="loading-dots">Register</span>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>
          <div>
            <p className="text-center text-sm  mt-4">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-blue-500">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
