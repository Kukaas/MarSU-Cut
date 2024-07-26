import { Toaster } from "sonner";
import ArchiveRentals from "./tables/ArchiveRentals";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const DashArchiveRentals = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=archive-rentals");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
    
  }, [currentUser, navigate]);
  
  return (
    <div className="w-full h-screen">
      <ArchiveRentals />
      <Toaster richColors />
    </div>
  );
};

export default DashArchiveRentals;
