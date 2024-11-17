import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

import Orders from "./tables/Orders";
import { Toaster } from "sonner";

const DashOrderAdmin = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=orders-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full h-screen overflow-x-auto">
      <Helmet>
        <title>MarSUKAT | Orders</title>
        <meta name="description" content="" />
      </Helmet>
      <Orders />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default DashOrderAdmin;
