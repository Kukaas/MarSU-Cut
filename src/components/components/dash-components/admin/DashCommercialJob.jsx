import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CommercialJob from "./tables/CommercialJob";
import { Toaster } from "sonner";

const DashCommercialJob = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=commercial-job-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full h-screen overflow-x-auto">
      <Helmet>
        <title>MarSU Cut | Commercial Job Orders</title>
        <meta name="description" content="" />
      </Helmet>
      <CommercialJob />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default DashCommercialJob;
