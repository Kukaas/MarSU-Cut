import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Productions from "./tables/Productions";
import { Toaster } from "sonner";

const DashProductions = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=productions");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <motion.div
      className="w-full h-screen overflow-x-auto"
      initial={{ opacity: 0, y: 50 }} // Initial state: hidden and slightly below
      animate={{ opacity: 1, y: 0 }} // Final state: visible and in position
      transition={{ duration: 0.5 }} // Transition duration
    >
      <Helmet>
        <title>MarSUKAT | Productions</title>
        <meta name="description" content="" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 50 }} // Productions component starts below
        animate={{ opacity: 1, y: 0 }} // Fade in and move to normal position
        transition={{ delay: 0.3, duration: 0.5 }} // Delay for effect
      >
        <Productions />
      </motion.div>

      <Toaster position="top-center" richColors closeButton />
    </motion.div>
  );
};

export default DashProductions;
