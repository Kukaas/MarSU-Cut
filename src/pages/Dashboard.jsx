import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  // Get tab from url
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="flex flex-col md:flex-row">
      {tab === "profile" && <DashProfile />}
      {/* Admin */}
      {tab === "home-admin" && <DashHomeAdmin />}
      {tab === "orders-admin" && <DashOrderAdmin />}
      {tab === "archive-orders" && <DashArchiveOrders />}
      {tab === "rentals-admin" && <DashRentalAdmin />}
      {tab === "archive-rentals" && <DashArchiveRentals />}
      {tab === "schedules" && <DashSchedules />}
      {tab === "finished-products" && <DashFinishedProduct />}
      {tab === "raw-materials" && <DashRawMaterials />}
      {tab === "accomplishment-report" && <DashAccomplishmentReport />}
      {tab === "sales-report" && <DashSalesReport />}

      {/* User */}
      {tab === "home" && <DashHome />}
      {tab === "orders" && <DashOrder />}
      {tab === "rentals" && <DashRental />}
      {tab === "commercial-job" && <DashCommercial />}
    </div>
  );
};

export default Dashboard;
