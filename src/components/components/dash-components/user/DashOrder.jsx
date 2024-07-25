import { Toaster } from "sonner";
import Orders from "./tables/Orders";

const DashOrder = () => {
  return (
    <div className="w-full h-screen">
      <Orders />
      <Toaster richColors />
    </div>
  );
};

export default DashOrder;
