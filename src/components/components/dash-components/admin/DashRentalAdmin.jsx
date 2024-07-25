import { Toaster } from "sonner";
import Rentals from "./tables/Rentals";

const DashRentalAdmin = () => {
  return (
    <div className="w-full h-screen">
      <Rentals />
      <Toaster richColors />
    </div>
  );
};

export default DashRentalAdmin;
