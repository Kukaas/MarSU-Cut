import { ToastProvider } from "@/components/ui/toast";
import Orders from "./tables/Orders";

const DashOrder = () => {
  return (
    <div className="w-full h-screen">
      <ToastProvider>
        <Orders />
      </ToastProvider>
    </div>
  );
};

export default DashOrder;
