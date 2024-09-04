// Components import
import DashProfile from "@/components/components/dash-components/DashProfile";
import DashHomeAdmin from "../components/components/dash-components/admin/DashHomeAdmin";
import DashHome from "../components/components/dash-components/user/DashHome";
import DashRental from "@/components/components/dash-components/user/DashRental";
import DashCommercial from "@/components/components/dash-components/user/DashCommercial";
import DashOrderAdmin from "@/components/components/dash-components/admin/DashOrderAdmin";
import DashRentalAdmin from "@/components/components/dash-components/admin/DashRentalAdmin";
import DashSchedules from "@/components/components/dash-components/admin/DashSchedules";
import DashFinishedProduct from "@/components/components/dash-components/admin/DashFinishedProduct";
import DashRawMaterials from "@/components/components/dash-components/admin/DashRawMaterials";
import DashAccomplishmentReport from "@/components/components/dash-components/admin/DashAccomplishmentReport";
import DashSalesReport from "@/components/components/dash-components/admin/DashSalesReport";
import DashArchiveOrders from "@/components/components/dash-components/admin/DashArchiveOrders";
import DashArchiveRentals from "@/components/components/dash-components/admin/DashArchiveRentals";
import DashUsers from "@/components/components/dash-components/admin/DashUsers";
import PropTypes from "prop-types";
import DashProductions from "@/components/components/dash-components/admin/DashProductions";
import DashCommercialJob from "@/components/components/dash-components/admin/DashCommercialJob";
import Sidebar from "@/components/components/Sidebar";

// Other Imports
import { useEffect, useState } from "react";
import OrderDetails from "@/components/components/dash-components/admin/OrderDetails";
import { useParams } from "react-router-dom";
import DashOrder from "@/components/components/dash-components/user/student/DashOrder";

const Dashboard = ({ tab }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { id } = useParams();

  const renderContent = () => {
    switch (tab) {
      case "profile":
        return <DashProfile />;
      case "home-admin":
        return <DashHomeAdmin />;
      case "orders-admin":
        return <DashOrderAdmin />;
      case "archive-orders":
        return <DashArchiveOrders />;
      case "rentals-admin":
        return <DashRentalAdmin />;
      case "commercial-job-admin":
        return <DashCommercialJob />;
      case "archive-rentals":
        return <DashArchiveRentals />;
      case "schedules":
        return <DashSchedules />;
      case "finished-products":
        return <DashFinishedProduct />;
      case "raw-materials":
        return <DashRawMaterials />;
      case "accomplishment-report":
        return <DashAccomplishmentReport />;
      case "sales-report":
        return <DashSalesReport />;
      case "all-users":
        return <DashUsers />;
      case "home":
        return <DashHome />;
      case "orders":
        return <DashOrder />;
      case "rentals":
        return <DashRental />;
      case "commercial-job":
        return <DashCommercial />;
      case "productions":
        return <DashProductions />;
      case "order-details":
        return <OrderDetails orderId={id} />;
      default:
        return null;
    }
  };

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 771);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {!isSmallScreen && <Sidebar />}
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
};

Dashboard.propTypes = {
  tab: PropTypes.string,
};

export default Dashboard;
