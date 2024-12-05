import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Toaster } from "sonner";
import Orders from "./Orders";
import { motion } from "framer-motion"; // Import motion from framer-motion

const DashOrder = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=home-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=orders");
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
      <div className="w-full h-screen overflow-x-auto">
        <Helmet>
          <title>MarSUKAT | Orders</title>
          <meta name="description" content="" />
        </Helmet>
        <Orders />
        <Toaster position="top-center" richColors closeButton />
      </div>
    </motion.div>
  );
};

export default DashOrder;
