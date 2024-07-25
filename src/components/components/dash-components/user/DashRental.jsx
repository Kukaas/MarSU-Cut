import { ToastProvider } from "@/components/ui/toast";
import Rentals from "./tables/Rentals";

const DashRental = () => {
  return (
    <div className="w-full h-screen">
      <ToastProvider>
        <Rentals />
      </ToastProvider>
    </div>
  );
};

export default DashRental;
