// UI
import { Typography } from "antd";

// others
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

import CustomCalendar from "../../custom-components/CustomCalendar";


const DashSchedules = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=schedules");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full p-5">
      <Typography.Title level={2} className="text-black dark:text-white">
        Schedules
      </Typography.Title>
      <div className="w-full h-screen flex items-center justify-center overflow-x-auto">
        <Helmet>
          <title>MarSU Cut | Schedules</title>
          <meta name="description" content="" />
        </Helmet>
        <CustomCalendar />
      </div>
    </div>
  );
};

export default DashSchedules;
