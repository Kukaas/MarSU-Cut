import { Toaster } from "sonner";
import ArchiveRentals from "./tables/ArchiveRentals";

const DashArchiveRentals = () => {
  return (
    <div className="w-full h-screen">
      <ArchiveRentals />
      <Toaster richColors />
    </div>
  );
};

export default DashArchiveRentals;
