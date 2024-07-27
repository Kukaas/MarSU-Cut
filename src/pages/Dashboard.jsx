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
  const token = currentUser.token;
  const parts = token.split(".");
  const url = parts[2];

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
      {tab === `profile/${currentUser._id}` && <DashProfile />}
      {/* Admin */}
      {tab === `home-admin/${url}` && <DashHomeAdmin />}
      {tab === `orders-admin/${currentUser._id}` && <DashOrderAdmin />}
      {tab === `archive-orders/${currentUser._id}` && <DashArchiveOrders />}
      {tab === `rentals-admin/${currentUser._id}` && <DashRentalAdmin />}
      {tab === `archive-rentals/${currentUser._id}` && <DashArchiveRentals />}
      {tab === `schedules/${currentUser._id}` && <DashSchedules />}
      {tab === `finished-products/${currentUser._id}` && (
        <DashFinishedProduct />
      )}
      {tab === `raw-materials/${currentUser._id}` && <DashRawMaterials />}
      {tab === `accomplishment-report/${currentUser._id}` && (
        <DashAccomplishmentReport />
      )}
      {tab === `sales-report/${currentUser._id}` && <DashSalesReport />}
      {tab === `all-users/${currentUser._id}` && <DashUsers />}

      {/* User */}
      {tab === `home/${url}` && <DashHome />}
      {tab === `orders/${currentUser._id}` && <DashOrder />}
      {tab === `rentals/${currentUser._id}` && <DashRental />}
      {tab === `commercial-job/${currentUser._id}` && <DashCommercial />}
    </div>
  );
};

export default Dashboard;
