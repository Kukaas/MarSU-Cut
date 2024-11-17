import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CustomCalendar } from "../../custom-components/CustomCalendar";
import CustomPageTitle from "../../custom-components/CustomPageTitle";

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
      {currentUser.role !== "Coordinator" && (
        <CustomPageTitle title="Schedules" description="View all schedules" />
      )}
      <div className="w-full h-[650px] flex items-center justify-center overflow-x-auto">
        <Helmet>
          <title>MarSUKAT | Dashboard</title>
          <meta name="description" content="" />
        </Helmet>
        {currentUser.role === "Coordinator" ? (
          <div>
            <h1 className="text-3xl font-bold">Welcome, Coordinator</h1>
          </div>
        ) : (
          <CustomCalendar />
        )}
      </div>
    </div>
  );
};

export default DashHome;
