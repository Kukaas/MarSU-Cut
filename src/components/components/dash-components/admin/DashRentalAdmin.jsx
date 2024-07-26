import { Toaster } from "sonner";
import Rentals from "./tables/Rentals";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const DashRentalAdmin = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate(`/dashboard?tab=rentals-admin/${currentUser.token.substring(0, 25)}`);
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate(`/dashboard?tab=home/${currentUser.token.substring(0, 25)}`);
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

export default DashRentalAdmin;
