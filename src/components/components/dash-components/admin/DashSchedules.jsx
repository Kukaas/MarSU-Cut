// others
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

import CustomCalendar from "../../custom-components/CustomCalendar";
import CustomPageTitle from "../../custom-components/CustomPageTitle";

const DashSchedules = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=schedules");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=schedules");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full p-5 h-screen overflow-auto">
      <CustomPageTitle title="Schedules" description="View all schedules" />
      <div className="w-full h-screen flex items-center justify-center overflow-x-auto">
        <Helmet>
          <title>MarSUKAT | Schedules</title>
          <meta name="description" content="" />
        </Helmet>
        <CustomCalendar />
      </div>
    </div>
  );
};

export default DashSchedules;
