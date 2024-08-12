import { Link, useLocation } from "react-router-dom";
import { Package2, Bell, Home, ShoppingCart, Shirt, Building2Icon } from "lucide-react";
import { Button } from "../ui/button";

const SidebarUser = () => {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const isActive = (path) => currentPath === path;

  return (
    <div className="flex h-screen flex-col gap-2 w-[250px] border-r-2">
      <div className="flex h-full max-h-screen flex-col gap-5">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-3 text-sm font-medium lg:px-4 gap-2">
            <Link
              to="/dashboard?tab=home"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard?tab=home")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/dashboard?tab=orders"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard?tab=orders")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Link>
            <Link
              to="/dashboard?tab=rentals"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard?tab=rentals")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Shirt className="h-4 w-4" />
              Rentals
            </Link>
            <Link
              to="/dashboard?tab=commercial-job"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard?tab=commercial-job")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Building2Icon className="h-4 w-4" />
              Commercial Job
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SidebarUser;
