// UI
import { Button } from "../ui/button";
import Notification from "./Notification";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

// icons
import { Bell, Home, ShoppingCart, Shirt, Building2Icon } from "lucide-react";

// others
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";

const MenuUser = () => {
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  const { currentUser } = useSelector((state) => state.user);
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  const isActive = (path) => currentPath === path;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/user/notifications/${currentUser._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        const notificationsData = res.data;

        // Check if notificationsData contains notifications array
        if (Array.isArray(notificationsData.notifications)) {
          const notifications = notificationsData.notifications;

          const unread = notifications.filter(
            (notification) => !notification.read
          );

          // Update state
          setUnreadNotifications(unread);
        } else {
          console.error(
            "Notifications is not an array:",
            notificationsData.notifications
          );
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [currentUser._id]);

  return (
    <div className="flex h-screen flex-col gap-2 w-full mt-2">
      <div className="flex h-full max-h-screen flex-col gap-5">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">
              {" "}
              {currentUser?.name?.split(" ")[0]}
            </span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="ml-20 h-8 w-8 relative"
              >
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
                {unreadNotifications && unreadNotifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="h-screen overflow-y-auto">
              <Notification />
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-3 text-sm font-medium lg:px-4 gap-2">
            <SheetTrigger asChild>
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
            </SheetTrigger>
            <SheetTrigger asChild>
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
            </SheetTrigger>
            <SheetTrigger asChild>
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
            </SheetTrigger>
            <SheetTrigger asChild>
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
            </SheetTrigger>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MenuUser;
