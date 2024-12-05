import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomPageTitle from "../../custom-components/CustomPageTitle";
import Dashboard from "./student/Dashboard";
import { Toaster } from "sonner";
import Schedules from "./Schedules";
import { motion } from "framer-motion"; // Import motion from framer-motion

const DashHome = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=home-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Fade-in effect with slide up
      animate={{ opacity: 1, y: 0 }} // End state: visible and in place
      transition={{ duration: 0.5 }} // Smooth transition
    >
      <div className="w-full h-screen p-5 overflow-x-auto bg-background text-foreground">
        {currentUser.role === "Student" ? (
          <CustomPageTitle
            title="Dashboard"
            description="View your dashboard"
          />
        ) : currentUser.role === "Coordinator" ? (
          <CustomPageTitle
            title="Dashboard"
            description="Welcome coordinator"
          />
        ) : (
          <CustomPageTitle title="Schedules" description="View schedules" />
        )}
        <div className="w-full pt-10">
          <Helmet>
            <title>MarSUKAT | Dashboard</title>
            <meta name="description" content="" />
          </Helmet>
          {currentUser.role === "Coordinator" ? (
            <div>
              <h1 className="text-3xl font-bold">Welcome, Coordinator</h1>
            </div>
          ) : currentUser.role === "Student" ? (
            <Dashboard />
          ) : (
            <Schedules />
          )}
        </div>
        <Toaster position="top-center" richColors closeButton />
      </div>
    </motion.div>
  );
};

export default DashHome;
