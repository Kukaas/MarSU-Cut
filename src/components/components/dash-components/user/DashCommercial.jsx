import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DashCommercial = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate(
        "/dashboard?tab=home-admin"
      );
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=commercial-job");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return <div>DashCommercial</div>;
};

export default DashCommercial;
