import { Row } from "antd";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

import Cards from "./dashboard-components/Cards";
import CustomPageTitle from "../../custom-components/CustomPageTitle";

const DashHomeAdmin = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=home-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/sign-in");
    }
  }, [currentUser, navigate]);

  return (
    <motion.div
      className="w-full min-h-screen p-5 overflow-x-auto"
      initial={{ opacity: 0, y: 50 }} // Start with 0 opacity and a little below
      animate={{ opacity: 1, y: 0 }} // Fade in and move to the normal position
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>MarSUKAT | Dashboard</title>
        <meta name="description" content="" />
      </Helmet>

      <motion.div
        className="w-full flex items-center justify-center overflow-x-auto"
        initial={{ opacity: 0, y: 50 }} // Title starts from below
        animate={{ opacity: 1, y: 0 }} // Title fades in and moves to the normal position
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <CustomPageTitle title="Dashboard" description="Welcome to MarSUKAT" />
      </motion.div>

      <motion.div
        className="mt-2"
        initial={{ opacity: 0, y: 50 }} // Cards start from below
        animate={{ opacity: 1, y: 0 }} // Cards fade in and move upwards
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Row gutter={[16, 16]} className="mt-2">
          <Cards />
        </Row>
      </motion.div>
    </motion.div>
  );
};

export default DashHomeAdmin;
