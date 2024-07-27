import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DashRawMaterials = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate(`/dashboard?tab=raw-materials/${currentUser._id}`);
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate(`/dashboard?tab=home/${currentUser.token.substring(0, 25)}`);
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return <div>DashRawMaterials</div>;
};

export default DashRawMaterials;
