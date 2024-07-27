import { message } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { loginFail, loginStart, loginSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schema/shema";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate(`/dashboard?tab=home-admin`);
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate(`/dashboard?tab=home`);
    } else {
      navigate("/sign-in");
    }
  }, [currentUser, navigate]);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle login
  const handleLogin = async (values) => {
    if (!values.email || !values.password) {
      message.error("Please fill all the fields");
      return;
    }
    try {
      setLoading(true);
      dispatch(loginStart());
      const res = await axios.post(
        "https://garments.kukaas.tech/api/v1/auth/sign-in",
        values,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const data = res.data;

      if (res.status === 200) {
        setLoading(false);
        dispatch(loginSuccess(data));
        message.success("Signin success");
        localStorage.setItem("token", data.token);
        const token = data.token;
        const parts = token.split(".");
        const url = parts[2];
        if (data.isAdmin) {
          navigate(`/dashboard?tab=home-admin/${url}`);
        } else {
          navigate(`/dashboard?tab=home/${url}`);
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        setLoading(false);
        message.error("User not found");
        dispatch(loginFail(error.response.data.message));
      } else if (error.response && error.response.status === 401) {
        setLoading(false);
        message.error("Wrong email or password");
        dispatch(loginFail(error.response.data.message));
      } else if (error.response && error.response.status === 403) {
        setLoading(false);
        message.error("Email Not Verified: Please Verify Your Email Address");
        dispatch(loginFail(error.response.data.message));
      } else {
        setLoading(false);
        dispatch(
          loginFail(
            error.message ||
              "The server took too long to respond. Please try again later."
          )
        );
      }
    }
  };

  return (
    <div className="min-h-[400px] mt-[100px] mb-8">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/* left */}
        <div className="flex-1 mb-4">
          <Link to="/" className="font-bold hover:text-current text-4xl ">
            Welcome{" "}
            <span className="px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Back!
            </span>
          </Link>
          <p className="text-l mt-4 ">Sign in with your email and password.</p>
        </div>
        {/* right */}
        <div className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-4"
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
              <div className="relative flex flex-col">
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
                <Link
                  to="/forgot-password"
                  className=" right-0 bottom-0 text-blue-500 text-sm mt-3"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full mt-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
              >
                {loading ? (
                  <span className="loading-dots">Signing in</span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
          <div>
            <p className="text-center text-sm mt-4">
              Don&apos;t have an account?{" "}
              <Link to="/sign-up" className="text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
