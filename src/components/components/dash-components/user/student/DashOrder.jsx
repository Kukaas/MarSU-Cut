import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Toaster } from "sonner";
import Orders from "./Orders";

const DashOrder = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=home-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=orders");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);
  return (
    <div className="w-full h-screen overflow-x-auto">
      <Helmet>
        <title>MarSU Cut | Orders</title>
        <meta name="description" content="" />
      </Helmet>
      <Orders />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default DashOrder;
