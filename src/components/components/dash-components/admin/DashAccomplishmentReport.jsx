import { Toaster } from "sonner";
import AccomplishmentReport from "./tables/AccomplishmentReport";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

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
        <title>MarSU Cut | Accomplishment Reports</title>
        <meta name="description" content="" />
      </Helmet>
      <AccomplishmentReport />
      <Toaster position="top-right" closeButton richColors />
    </div>
  );
};

export default DashAccomplishmentReport;
