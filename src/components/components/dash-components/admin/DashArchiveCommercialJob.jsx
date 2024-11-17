import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Toaster } from "sonner";
import ArchiveCommercialJob from "./tables/ArchiveCommercialJob";

const DashArchiveCommercialjob = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=archive-commercial-job");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full h-screen overflow-x-auto">
      <Helmet>
        <title>MarSUKAT | Archive Commercial Job Orders</title>
        <meta name="description" content="" />
      </Helmet>
      <ArchiveCommercialJob />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default DashArchiveCommercialjob;
