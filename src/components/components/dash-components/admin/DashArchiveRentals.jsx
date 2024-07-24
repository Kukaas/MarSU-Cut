import { ToastProvider } from "@/components/ui/toast";
import ArchiveRentals from "./tables/ArchiveRentals";

const DashArchiveRentals = () => {
  return (
    <div className="w-full h-screen">
      <ToastProvider>
        <ArchiveRentals />
      </ToastProvider>
    </div>
  );
};

export default DashArchiveRentals;
