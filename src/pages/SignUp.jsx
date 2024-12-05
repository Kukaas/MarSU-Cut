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
import LeftSideDescription from "@/components/components/custom-components/LeftSideDescription";
import { motion } from "framer-motion";

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
    <motion.div
      className="min-h-[500px] mt-[50px] mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>MarSUKAT | Sign Up</title>
        <meta name="description" content="" />
        <meta name="keywords" content="marsu sign up, MarSUKAT" />
      </Helmet>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/* left */}
        <LeftSideDescription
          black="Welcome to "
          gradient="MarSUKAT"
          description="Sign up to get started"
        />
        {/* right */}
        <motion.div
          className="flex-1"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
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
          <motion.div
            className="mt-4 text-center text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p>
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="text-blue-400 underline hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
      <Toaster position="top-center" closeButton richColors />
    </motion.div>
  );
};

export default SignUp;
