import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography } from "antd";
import SalesSummary from "./sales-components/SalesSummary";
import { Button } from "@/components/ui/button";

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
      <div className="flex justify-between items-center">
        <Typography.Title level={2} className="text-black dark:text-white">
          Sales Report
        </Typography.Title>
        <Button type="primary" onClick={() => window.print()}>
          Print
        </Button>
      </div>
      <Helmet>
        <title>MarSU Cut | Sales Report</title>
        <meta name="description" content="" />
      </Helmet>
      <SalesSummary />
    </div>
  );
};

export default DashSalesReport;
