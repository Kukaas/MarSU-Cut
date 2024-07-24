import { ToastProvider } from "@/components/ui/toast";
import Users from "./tables/Users";

const DashUsers = () => {
  return (
    <div className="w-full h-screen">
      <ToastProvider>
        <Users />
      </ToastProvider>
    </div>
  );
};

export default DashUsers;
