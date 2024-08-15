import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LastTransactions from "./sales-components/LastTransactions";
import RightSideBar from "./sales-components/RightSideBar";
import { Typography } from "antd";
import SalesSummary from "./sales-components/SalesSummary";

const DashSalesReport = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 771);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
      <div className="mx-auto p-4 flex">
        <div className={isSmallScreen ? "w-full" : "w-3/4 pr-2"}>
          <SalesSummary />
          <LastTransactions />
        </div>
        {!isSmallScreen && (
          <div className="w-1/8 pl-4">
            <RightSideBar />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashSalesReport;
