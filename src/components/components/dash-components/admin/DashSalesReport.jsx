import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography } from "antd";
import SalesSummary from "./sales-components/SalesSummary";

const DashSalesReport = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=sales-report");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full p-5 h-screen">
      <Typography.Title level={2} className="text-black dark:text-white">
        Sales Report
      </Typography.Title>
      <Helmet>
        <title>MarSU Cut | Sales Report</title>
        <meta name="description" content="" />
      </Helmet>
      <SalesSummary />
    </div>
  );
};

export default DashSalesReport;
