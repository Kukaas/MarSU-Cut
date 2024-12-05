import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion from framer-motion

import CommercialJob from "./tables/CommercialJob";
import { Toaster } from "sonner";

const DashCommercialJob = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=commercial-job-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <motion.div
      className="w-full h-screen overflow-x-auto"
      initial={{ opacity: 0, y: 50 }} // Initial state: hidden and below
      animate={{ opacity: 1, y: 0 }} // Final state: visible and at its position
      transition={{ duration: 0.5 }} // Transition duration
    >
      <Helmet>
        <title>MarSUKAT | Commercial Job Orders</title>
        <meta name="description" content="" />
      </Helmet>

      {/* CommercialJob table animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} // Start with CommercialJob table hidden and below
        animate={{ opacity: 1, y: 0 }} // Fade in and move up
        transition={{ delay: 0.3, duration: 0.5 }} // Delay for smoother entry
      >
        <CommercialJob />
      </motion.div>

      <Toaster position="top-center" richColors closeButton />
    </motion.div>
  );
};

export default DashCommercialJob;
