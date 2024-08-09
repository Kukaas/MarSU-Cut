import AcademicInventory from "./tables/AcademicInventory";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { Helmet } from "react-helmet";

const DashAcademicInventory = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=academic-inventory");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);
  return (
    <div className="w-full h-screen overflow-x-auto">
      <Helmet>
        <title>MarSU Cut | Academic Inventory</title>
        <meta name="description" content="" />
      </Helmet>
      <AcademicInventory />
      <Toaster richColors />
    </div>
  );
};

export default DashAcademicInventory;
