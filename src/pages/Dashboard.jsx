import DashProfile from "@/components/components/dash-components/DashProfile";
import DashHomeAdmin from "../components/components/dash-components/admin/DashHomeAdmin";
import DashHome from "../components/components/dash-components/user/DashHome";
import DashOrder from "@/components/components/dash-components/user/DashOrder";
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
import PropTypes from 'prop-types'
import DashAcademicInventory from "@/components/components/dash-components/admin/DashAcademicInventory";
import DashProductions from "@/components/components/dash-components/admin/DashProductions";

const Dashboard = ({ tab }) => {
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
      case "academic-inventory":
        return <DashAcademicInventory />;
      case "productions":
        return <DashProductions />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      {renderContent()}
    </div>
  );
};

Dashboard.propTypes = {
  tab: PropTypes.string,
};

export default Dashboard;
