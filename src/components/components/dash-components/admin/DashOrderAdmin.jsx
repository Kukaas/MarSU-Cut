import { ToastProvider } from "@/components/ui/toast";
import Orders from "./tables/Orders";

const DashOrderAdmin = () => {
  return (
    <div className="w-full h-screen">
      <ToastProvider>
        <Orders />
      </ToastProvider>
    </div>
  );
};

export default DashOrderAdmin;
