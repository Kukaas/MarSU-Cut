import { Toaster } from "sonner";
import Rentals from "./tables/Rentals";

const DashRental = () => {
  return (
    <div className="w-full h-screen">

        <Rentals />
        <Toaster richColors />
    </div>
  );
};

export default DashRental;
