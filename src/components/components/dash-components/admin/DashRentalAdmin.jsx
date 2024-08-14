import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

import Rentals from "./tables/Rentals";
import { Toaster } from "sonner";

const DashRentalAdmin = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=rentals-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);
  return (
    <div className="w-full h-screen overflow-x-auto">
      <Helmet>
        <title>MarSU Cut | Rentals</title>
        <meta name="description" content="" />
      </Helmet>
      <Rentals />
      <Toaster position="top-right" richColors closeButton/>
    </div>
  );
};

export default DashRentalAdmin;
