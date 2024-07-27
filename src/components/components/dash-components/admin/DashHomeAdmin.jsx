import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DashHomeAdmin = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser.token;
  const parts = token.split(".");
  const url = parts[2];

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate(`/dashboard?tab=home-admin/${url}`);
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate(`/dashboard?tab=home/${url}`);
    } else {
      navigate("/");
    }
  }, [currentUser, navigate, url]);

  return <div>DashHomeAdmin</div>;
};

export default DashHomeAdmin;
