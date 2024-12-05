import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion"; // Import motion from framer-motion

import Rentals from "./tables/Rentals";
import { Toaster } from "sonner";

const DashRentalAdmin = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=rentals-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <motion.div
      className="w-full h-screen overflow-x-auto"
      initial={{ opacity: 0, y: 50 }} // Start with the page hidden and slightly below
      animate={{ opacity: 1, y: 0 }} // Animate to normal position
      transition={{ duration: 0.5 }} // Transition duration of 0.5 seconds
    >
      <Helmet>
        <title>MarSUKAT | Rentals</title>
        <meta name="description" content="" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 50 }} // Rentals component starts below and hidden
        animate={{ opacity: 1, y: 0 }} // Fade in and move up to the final position
        transition={{ delay: 0.3, duration: 0.5 }} // Delay for 0.3 seconds
      >
        <Rentals />
      </motion.div>

      <Toaster position="top-center" richColors closeButton />
    </motion.div>
  );
};

export default DashRentalAdmin;
