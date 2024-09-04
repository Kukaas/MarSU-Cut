// UI
import { Toaster } from "sonner";

// others
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CoordinatorSignUp from "./sign-up-components/CoordinatorSignUp";
import StudentSignUp from "./sign-up-components/StudentSignUp";
import CommercialSignUp from "./sign-up-components/CommercialSignUp";

const SignUp = () => {
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
              <span
                className="rounded-lg text-white"
                style={{
                  background:
                    "linear-gradient(90deg, hsla(48, 80%, 66%, 1) 0%, hsla(0, 100%, 25%, 1) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                MSC Garments
              </span>
            </div>
          </Link>
          <p className="text-l mt-4">Sign up with your email.</p>
        </div>
        {/* right */}
        <div className="flex-1">
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-3 gap-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="coordinator">Coordinator</TabsTrigger>
              <TabsTrigger value="commercial">Commercial</TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <Card>
                <CardHeader>
                  <CardTitle>Student Sign Up</CardTitle>
                  <CardDescription>
                    Sign up with your email and password.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <StudentSignUp />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="coordinator">
              <Card>
                <CardHeader>
                  <CardTitle>Coordinator</CardTitle>
                  <CardDescription>
                    Sign up with your email and password.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CoordinatorSignUp />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="commercial">
              <Card>
                <CardHeader>
                  <CardTitle>Commercial Job</CardTitle>
                  <CardDescription>
                    Sign up with your email and password.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CommercialSignUp />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
