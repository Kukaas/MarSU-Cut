import { ToastProvider } from "@/components/ui/toast";
import Rentals from "./tables/Rentals";

const DashRentalAdmin = () => {
  return <div className="w-full h-screen">
  <ToastProvider>
    <Rentals />
  </ToastProvider>
</div>;
};

export default DashRentalAdmin;
