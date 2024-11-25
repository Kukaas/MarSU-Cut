import { Helmet } from "react-helmet";
import { Toaster } from "sonner";
import SystemMaintenance from "./tables/SytemMaintenance/SystemMaintenance";

const DashSystemMaintenance = () => {
  return (
    <div className="w-full h-screen overflow-x-auto">
      <Helmet>
        <title>MarSUKAT | Maintenance</title>
        <meta name="description" content="" />
      </Helmet>
      <SystemMaintenance />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default DashSystemMaintenance;
