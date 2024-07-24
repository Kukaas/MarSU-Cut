import { ToastProvider } from "@/components/ui/toast";
import ArchiveOrders from "./tables/ArchiveOrders";

const DashArchiveOrders = () => {
  return (
    <div className="w-full h-screen">
      <ToastProvider>
        <ArchiveOrders />
      </ToastProvider>
    </div>
  );
};

export default DashArchiveOrders;
