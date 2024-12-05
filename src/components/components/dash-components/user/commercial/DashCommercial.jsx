import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import CommercialJob from "./CommercialJob";
import { motion } from "framer-motion"; // Import motion from framer-motion

const DashCommercial = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=home-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=commercial-job");
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
          <title>MarSUKAT | Commercial Job</title>
          <meta name="description" content="" />
        </Helmet>
        <CommercialJob />
        <Toaster position="top-center" richColors closeButton />
      </div>
    </motion.div>
  );
};

export default DashCommercial;
