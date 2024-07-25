
import { Toaster } from "sonner";
import Orders from "./tables/Orders";

const DashOrderAdmin = () => {
  return (
    <div className="w-full h-screen">
        <Orders />
        <Toaster richColors />
    </div>
  );
};

export default DashOrderAdmin;
