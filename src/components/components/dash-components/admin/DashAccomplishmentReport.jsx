import { Toaster } from "sonner";
import AccomplishmentReport from "./tables/AccomplishmentReport";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const DashAccomplishmentReport = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate(`/dashboard?tab=accomplishment-report/${currentUser.token.substring(0, 25)}`);
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate(`/dashboard?tab=home/${currentUser.token.substring(0, 25)}`);
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full h-screen">
      <AccomplishmentReport />
      <Toaster richColors />
    </div>
  );
};

export default DashAccomplishmentReport;
