import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FinishedProduct from "./tables/FinishedProduct";
import { Helmet } from "react-helmet";

const DashFinishedProduct = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=finished-products");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full h-screen overfolow-x-auto">
      <Helmet>
        <title>MarSU Cut | Finished Products</title>
        <meta name="description" content="" />
      </Helmet>
      <FinishedProduct />
    </div>
  );
};

export default DashFinishedProduct;
