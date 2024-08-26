// UI
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { notification } from "antd";

// icons
import { Loader2 } from "lucide-react";

// others
import { RegisterSchema } from "@/schema/shema";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { BASE_URL } from "@/lib/api";
import ToasterError from "@/lib/Toaster";
import CustomInput from "@/components/components/CustomInput";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=home-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/sign-up");
    }
  }, [currentUser, navigate]);

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Handle register
  const handleRegister = async (values) => {
    if (values.password && values.password.includes(" ")) {
      toast.error("Password cannot contain spaces");
      return;
    }

    if (values.password && values.password.length < 6) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match", {
        description:
          "Please make sure your password and confirm password match.",
      });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/v1/auth/sign-up`, values, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        navigate("/sign-in");
        notification.success({
          message: "Registration successful",
          description: "Please check your email for verification.",
          closable: true,
          duration: 5,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setLoading(false);
        toast.error("Email is already taken", {
          description: "Please try another email.",
        });
      } else if (error.response && error.response.status === 401) {
        setLoading(false);
        toast.error("Name already taken", {
          description: "Please try another name.",
        });
      } else {
        setLoading(false);
        ToasterError({
          description: "Please check your internet connection and try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[500px] mt-[50px] mb-8">
      <Helmet>
        <title>MarSU Cut | Sign Up</title>
        <meta name="description" content="" />
        <meta name="keywords" content="marsu sign up, marsu cut" />
      </Helmet>
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
              <CustomInput
                form={form}
                name="name"
                label="Name"
                placeholder="Enter your name..."
              />
              <CustomInput
                form={form}
                name="email"
                label="Email"
                placeholder="Enter your email..."
              />
              <CustomInput
                form={form}
                name="password"
                label="Password"
                placeholder="Enter your password..."
                type="password"
              />
              <CustomInput
                form={form}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password..."
                type="password"
              />
              <Button
                type="submit"
                className="w-full mt-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 animate-spin" />
                    <span>Registering</span>
                  </div>
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
      <Toaster position="top-center" closeButton richColors />
    </div>
  );
};

export default SignUp;
