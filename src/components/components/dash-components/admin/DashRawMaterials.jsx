import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import RawMaterials from "./tables/RawMaterials";
import { Toaster } from "sonner";

const DashRawMaterials = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=raw-materials");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full h-screen overflow-x-auto">
      <Helmet>
        <title>MarSU Cut | Raw Materials</title>
        <meta name="description" content="" />
      </Helmet>
      <RawMaterials />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default DashRawMaterials;
