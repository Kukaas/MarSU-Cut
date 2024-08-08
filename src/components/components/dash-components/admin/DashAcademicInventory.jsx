import AcademicInventory from "./tables/AcademicInventory";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "sonner";

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
      <AcademicInventory />
      <Toaster richColors />
    </div>
  );
};

export default DashAcademicInventory;
