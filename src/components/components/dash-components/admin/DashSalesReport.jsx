import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DashSalesReport = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate(`/dashboard?tab=sales-report/${currentUser._id}`);
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate(`/dashboard?tab=home/${currentUser.token.substring(0, 25)}`);
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return <div>DashSalesReport</div>;
};

export default DashSalesReport;
