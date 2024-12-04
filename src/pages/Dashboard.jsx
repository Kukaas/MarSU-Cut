// Components import

import DashAccomplishmentReport from "@/components/components/dash-components/admin/DashAccomplishmentReport";
import DashArchiveOrders from "@/components/components/dash-components/admin/DashArchiveOrders";
import DashArchiveRentals from "@/components/components/dash-components/admin/DashArchiveRentals";
import DashCommercialJob from "@/components/components/dash-components/admin/DashCommercialJob";
import DashFinishedProduct from "@/components/components/dash-components/admin/DashFinishedProduct";
import DashHomeAdmin from "@/components/components/dash-components/admin/DashHomeAdmin";
import DashOrderAdmin from "@/components/components/dash-components/admin/DashOrderAdmin";
import DashProductions from "@/components/components/dash-components/admin/DashProductions";
import DashRawMaterials from "@/components/components/dash-components/admin/DashRawMaterials";
import DashRentalAdmin from "@/components/components/dash-components/admin/DashRentalAdmin";
import DashSalesReport from "@/components/components/dash-components/admin/DashSalesReport";
import DashSchedules from "@/components/components/dash-components/admin/DashSchedules";
import DashUsers from "@/components/components/dash-components/admin/DashUsers";
import OrderDetails from "@/components/components/dash-components/admin/OrderDetails";
import DashProfile from "@/components/components/dash-components/DashProfile";
import DashCommercial from "@/components/components/dash-components/user/commercial/DashCommercial";
import DashHome from "@/components/components/dash-components/user/DashHome";
import DashRental from "@/components/components/dash-components/user/rental/DashRental";
import DashOrder from "@/components/components/dash-components/user/student/DashOrder";
import DashArchiveCommercialjob from "@/components/components/dash-components/admin/DashArchiveCommercialJob";
import DashSystemMaintenance from "@/components/components/dash-components/admin/DashSystemMaintenance";

// Other Imports
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "@/components/components/Sidebar";
import DashAcademicGownInventory from "@/components/components/dash-components/admin/DashAcademicGownInventory";

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
      case "archive-commercial-job":
        return <DashArchiveCommercialjob />;
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
      case "system-maintenance":
        return <DashSystemMaintenance />;
      case "academic-gown-inventory":
        return <DashAcademicGownInventory />;
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
