import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CustomCalendar } from "../../custom-components/CustomCalendar";

const DashHome = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=home-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full h-screen p-5 overflow-x-auto">
      <div className="w-full h-screen flex items-center justify-center overflow-x-auto">
        <Helmet>
          <title>MarSU Cut | Dashboard</title>
          <meta name="description" content="" />
        </Helmet>
        <CustomCalendar />
      </div>
    </div>
  );
};

export default DashHome;
