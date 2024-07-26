import { Toaster } from "sonner";
import Rentals from "./tables/Rentals";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const DashRental = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=home-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=rentals");
    } else {
      navigate("/");
    }
    
  }, [currentUser, navigate]);
  
  return (
    <div className="w-full h-screen">

        <Rentals />
        <Toaster richColors />
    </div>
  );
};

export default DashRental;
