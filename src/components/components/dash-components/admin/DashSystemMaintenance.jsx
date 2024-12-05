import { motion } from "framer-motion"; // Import motion from framer-motion
import { Helmet } from "react-helmet";
import { Toaster } from "sonner";
import SystemMaintenance from "./tables/SytemMaintenance/SystemMaintenance";

const DashSystemMaintenance = () => {
  return (
    <motion.div
      className="w-full h-screen overflow-x-auto"
      initial={{ opacity: 0, y: 50 }} // Start with opacity 0 and moved down
      animate={{ opacity: 1, y: 0 }} // Fade in and move to position
      transition={{ duration: 0.5 }} // Duration for the transition
    >
      <Helmet>
        <title>MarSUKAT | Maintenance</title>
        <meta name="description" content="" />
      </Helmet>

      {/* System Maintenance table animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} // Start with opacity 0 and moved down
        animate={{ opacity: 1, y: 0 }} // Fade in and move up
        transition={{ delay: 0.3, duration: 0.5 }} // Delay for smoother entry
      >
        <SystemMaintenance />
      </motion.div>

      <Toaster position="top-center" richColors closeButton />
    </motion.div>
  );
};

export default DashSystemMaintenance;
