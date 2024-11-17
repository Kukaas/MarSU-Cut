import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

import AccomplishmentReport from "./tables/AccomplishmentReport";
import { Toaster } from "sonner";

const DashAccomplishmentReport = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=accomplishment-report");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full h-screen overflow-x-auto">
      <Helmet>
        <title>MarSUKAT | Accomplishment Reports</title>
        <meta name="description" content="" />
      </Helmet>
      <AccomplishmentReport />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default DashAccomplishmentReport;
