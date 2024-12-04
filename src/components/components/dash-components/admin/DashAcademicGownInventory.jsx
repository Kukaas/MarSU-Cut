import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import AcademicGownInventory from "./tables/AcademicGownInventory";

const DashAcademicGownInventory = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=academic-gown-inventory");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full h-screen overfolow-x-auto">
      <Helmet>
        <title>MarSUKAT | Finished Products</title>
        <meta name="description" content="" />
      </Helmet>
      <AcademicGownInventory />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default DashAcademicGownInventory;
