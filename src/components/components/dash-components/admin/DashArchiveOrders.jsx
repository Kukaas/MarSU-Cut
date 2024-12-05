import { motion } from "framer-motion"; // Import motion from framer-motion
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

import ArchiveOrders from "./tables/ArchiveOrders";
import { Toaster } from "sonner";

const DashArchiveOrders = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=archive-orders");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <motion.div
      className="w-full h-screen overflow-x-auto"
      initial={{ opacity: 0, y: 50 }} // Start with opacity 0 and moved down
      animate={{ opacity: 1, y: 0 }} // Fade in and move to position
      transition={{ duration: 0.5 }} // Duration for the transition
    >
      <Helmet>
        <title>MarSUKAT | Archive Orders</title>
        <meta name="description" content="" />
      </Helmet>

      {/* Archive Orders table animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} // Start with opacity 0 and moved down
        animate={{ opacity: 1, y: 0 }} // Fade in and move up
        transition={{ delay: 0.3, duration: 0.5 }} // Delay for smoother entry
      >
        <ArchiveOrders />
      </motion.div>

      <Toaster position="top-center" richColors closeButton />
    </motion.div>
  );
};

export default DashArchiveOrders;
