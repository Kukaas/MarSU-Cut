import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomPageTitle from "../../custom-components/CustomPageTitle";
import Dashboard from "./student/Dashboard";
import { Toaster } from "sonner";

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
    <div className="w-full h-screen p-5 overflow-x-auto bg-background text-foreground">
      {currentUser.role !== "Coordinator" && (
        <CustomPageTitle title="Dashboard" description="View your dashboard" />
      )}
      <div className="w-full pt-10">
        <Helmet>
          <title>MarSUKAT | Dashboard</title>
          <meta name="description" content="" />
        </Helmet>
        {currentUser.role === "Coordinator" ? (
          <div>
            <h1 className="text-3xl font-bold">Welcome, Coordinator</h1>
          </div>
        ) : (
          <Dashboard />
        )}
      </div>
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default DashHome;
