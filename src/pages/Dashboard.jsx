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
import DashUsers from "@/components/components/dash-components/admin/DashUsers";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);

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
      {tab === `profile/${currentUser.token.substring(0, 25)}` && <DashProfile />}
      {/* Admin */}
      {tab === `home-admin/${currentUser.token.substring(0, 25)}` && <DashHomeAdmin />}
      {tab === `orders-admin/${currentUser.token.substring(0, 25)}` && <DashOrderAdmin />}
      {tab === `archive-orders/${currentUser.token.substring(0, 25)}` && <DashArchiveOrders />}
      {tab === `rentals-admin/${currentUser.token.substring(0, 25)}` && <DashRentalAdmin />}
      {tab === `archive-rentals/${currentUser.token.substring(0, 25)}` && <DashArchiveRentals />}
      {tab === `schedules/${currentUser.token.substring(0, 25)}` && <DashSchedules />}
      {tab === `finished-products/${currentUser.token.substring(0, 25)}` && (
        <DashFinishedProduct />
      )}
      {tab === `raw-materials/${currentUser.token.substring(0, 25)}` && <DashRawMaterials />}
      {tab === `accomplishment-report/${currentUser.token.substring(0, 25)}` && (
        <DashAccomplishmentReport />
      )}
      {tab === `sales-report/${currentUser.token.substring(0, 25)}` && <DashSalesReport />}
      {tab === `all-users/${currentUser.token.substring(0, 25)}` && <DashUsers />}

      {/* User */}
      {tab === `home/${currentUser.token.substring(0, 25)}` && <DashHome />}
      {tab === `orders/${currentUser.token.substring(0, 25)}` && <DashOrder />}
      {tab === `rentals/${currentUser.token.substring(0, 25)}` && <DashRental />}
      {tab === `commercial-job/${currentUser.token.substring(0, 25)}` && <DashCommercial />}
    </div>
  );
};

export default Dashboard;
