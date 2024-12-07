import { Typography } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";

import "react-circular-progressbar/dist/styles.css";

// others
import { useNavigate } from "react-router-dom";

import { Helmet } from "react-helmet";

import SkeletonProfile from "../SkeletonProfile";
import ChangePassword from "../forms/ChangePassword";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StudentProfile from "./profile-components/StudentProfile";
import CoordinatorProfile from "./profile-components/CoordinatorProfile";
import CommercialProfile from "./profile-components/CommercialProfile";
import CustomPageTitle from "../custom-components/CustomPageTitle";
import { motion } from "framer-motion"; // Import motion from framer-motion

const DashProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=profile");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=profile");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Simulate a data fetch with a timeout
  useEffect(() => {
    setTimeout(() => {
      setSkeletonLoading(false);
    }, 2000);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Fade-in effect with slide up
      animate={{ opacity: 1, y: 0 }} // End state: visible and in place
      transition={{ duration: 0.5 }} // Smooth transition
    >
      <div className="p-5 h-screen w-full overflow-auto">
        <CustomPageTitle
          title="Profile"
          description="View and edit your profile"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Helmet>
            <title>MarSUKAT | Profile</title>
            <meta name="description" content="" />
          </Helmet>
          <div className="p-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <Separator />
              {skeletonLoading ? (
                <SkeletonProfile />
              ) : (
                <CardContent className="max-h-[650px] overflow-auto">
                  {currentUser.role === "Student" && <StudentProfile />}
                  {currentUser.role === "Coordinator" && <CoordinatorProfile />}
                  {currentUser.role === "CommercialJob" && (
                    <CommercialProfile />
                  )}
                  {currentUser.isAdmin && (
                    <Typography.Title
                      level={5}
                      className="text-black dark:text-white mt-5"
                    >
                      You are an admin, you don&apos;t need to edit your profile
                    </Typography.Title>
                  )}
                </CardContent>
              )}
            </Card>
          </div>
          <div className="p-2">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent>
                <ChangePassword />
              </CardContent>
            </Card>
          </div>
          <Toaster position="top-center" richColors closeButton />
        </div>
      </div>
    </motion.div>
  );
};

export default DashProfile;
