import { Toaster } from "sonner";
import ArchiveOrders from "./tables/ArchiveOrders";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

const DashArchiveOrders = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=archive-orders");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full h-screen overflow-x-auto">
      <Helmet>
        <title>MarSU Cut | Archive Orders</title>
        <meta name="description" content="" />
      </Helmet>
      <ArchiveOrders />
      <Toaster  closeButton richColors />
    </div>
  );
};

export default DashArchiveOrders;
