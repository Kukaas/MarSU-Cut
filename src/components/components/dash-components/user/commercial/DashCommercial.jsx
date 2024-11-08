import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import CommercialJob from "./CommercialJob";

const DashCommercial = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=home-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=commercial-job");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full h-screen overflow-x-auto">
      <Helmet>
        <title>MarSU Cut | Commercial Job</title>
        <meta name="description" content="" />
      </Helmet>
      <CommercialJob />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default DashCommercial;
