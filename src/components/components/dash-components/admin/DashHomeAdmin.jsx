import { Button } from "@/components/ui/button";
import { Col, Row, Typography } from "antd";
import Cards from "./dashboard-components/Cards";
import Chart from "./dashboard-components/Chart";
import Table from "./dashboard-components/Table";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashHomeAdmin = () => {
  const navigate = useNavigate();
   const {currentUser} = useSelector((state) => state.user);

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
    <div className="w-full min-h-screen p-10 overflow-x-auto">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={18}>
          <div>
            <Typography.Title level={2} className="text-black dark:text-white">
              Dashboard
            </Typography.Title>
            <Typography.Text className="text-black dark:text-gray-500">
              Welcome to the dashboard.
            </Typography.Text>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="flex lg:justify-end justify-start">
            <Button>Download</Button>
          </div>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-5">
        <Cards />
      </Row>
      <Row gutter={[16, 16]} className="mt-8">
        <Col xs={24} sm={24} lg={12}>
          <Chart className="rounded-md border"/>
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <Table />
        </Col>
      </Row>
    </div>
  );
};

export default DashHomeAdmin;
