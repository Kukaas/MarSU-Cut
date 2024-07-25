import { Toaster } from "sonner";
import ArchiveOrders from "./tables/ArchiveOrders";

const DashArchiveOrders = () => {
  return (
    <div className="w-full h-screen">
      <ArchiveOrders />
      <Toaster richColors />
    </div>
  );
};

export default DashArchiveOrders;
