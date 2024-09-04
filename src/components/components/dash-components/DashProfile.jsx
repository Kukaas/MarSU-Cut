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
    <div className="p-5 h-screen w-full overflow-auto">
      <Typography.Title level={2} className="text-black dark:text-white">
        Profile
      </Typography.Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Helmet>
          <title>MarSU Cut | Profile</title>
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
              <CardContent className="max-h-[450px] overflow-auto">
                {currentUser.role === "Student" && <StudentProfile />}
                {currentUser.role === "Coordinator" && <CoordinatorProfile />}
                {currentUser.role === "CommercialJob" && <CommercialProfile />}
                {currentUser.isAdmin && (
                  <Typography.Text>
                    You are an admin, you can&apos;t edit your profile
                  </Typography.Text>
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
  );
};

export default DashProfile;
