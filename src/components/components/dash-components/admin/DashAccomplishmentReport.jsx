import { Toaster } from "sonner";
import AccomplishmentReport from "./tables/AccomplishmentReport";

const DashAccomplishmentReport = () => {
  return (
    <div className="w-full h-screen">
      <AccomplishmentReport />
      <Toaster richColors />
    </div>
  );
};

export default DashAccomplishmentReport;
