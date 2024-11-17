// UI
import { Button } from "@/components/ui/button";
import { Col, Row, Typography } from "antd";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

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
    <div className="w-full min-h-screen p-5 overflow-x-auto">
      <Helmet>
        <title>MarSUKAT | Dashboard</title>
        <meta name="description" content="" />
      </Helmet>

      <div className="w-full flex items-center justify-center overflow-x-auto">
        <CustomPageTitle title="Dashboard" description="Welcome to MarSUKAT" />
      </div>

      <Row gutter={[16, 16]} className="mt-2">
        <Cards />
      </Row>
    </div>
  );
};

export default DashHomeAdmin;
