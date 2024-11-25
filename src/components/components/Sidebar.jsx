import {
  Badge,
  BarChart,
  Bell,
  Building,
  Calendar,
  Clipboard,
  Home,
  LineChart,
  Package,
  Package2Icon,
  PackageOpen,
  PieChart,
  Shirt,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Notification from "./Notification";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import axios from "axios";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import { GearIcon } from "@radix-ui/react-icons";

const Sidebar = () => {
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
    <div className="flex h-screen flex-col gap-2 w-[250px] border-r-2 light:mt-2">
      <div className="flex h-full max-h-screen flex-col gap-5">
        <div className="flex justify-between h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">
              {" "}
              {currentUser?.name?.split(" ")[0]} |
            </span>
            <span className="text-muted-foreground">
              {currentUser?.role === "JO" && currentUser.isAdmin ? "JO" : ""}
              {currentUser?.role === "Admin" ? "Admin" : ""}
              {currentUser?.role === "Student" ||
              currentUser?.role === "Coordinator" ||
              currentUser?.role === "CommercialJob"
                ? "User"
                : ""}
            </span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="ml-10 h-8 w-8 relative"
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
            <SheetContent className="max-h-screen overflow-auto">
              <Notification />
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex-1 overflow-auto">
          <nav className="grid items-start px-3 text-sm font-medium lg:px-4 gap-2">
            {currentUser.role === "JO" && currentUser.isAdmin && (
              <>
                <Link
                  to="/dashboard?tab=home"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/dashboard?tab=home-admin")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/dashboard?tab=productions"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/dashboard?tab=productions")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Package className="h-4 w-4" />
                  Productions
                </Link>

                {/* Inventory */}
                <Accordion
                  type="single"
                  collapsible
                  className="w-full rounded-lg"
                >
                  <AccordionItem value="item-2">
                    <AccordionTrigger
                      className={`flex items-center justify-between px-3 py-2 text-left transition-all ${
                        isActive("item-2")
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        Inventory
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <Link
                          to="/dashboard?tab=raw-materials"
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            isActive("/dashboard?tab=raw-materials")
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <Package2Icon className="h-4 w-4" />
                          Raw Materials
                        </Link>
                        <Link
                          to="/dashboard?tab=finished-products"
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            isActive("/dashboard?tab=finished-products")
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <PackageOpen className="h-4 w-4" />
                          Finished Product
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Reports */}
                <Accordion
                  type="single"
                  collapsible
                  className="w-full rounded-lg"
                >
                  <AccordionItem value="item-3">
                    <AccordionTrigger
                      className={`flex items-center justify-between px-3 py-2 text-left transition-all ${
                        isActive("item-3")
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <LineChart className="h-4 w-4" />
                        Reports
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <Link
                          to="/dashboard?tab=accomplishment-report"
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            isActive("/dashboard?tab=accomplishment-report")
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <PieChart className="h-4 w-4" />
                          Accomplisment Report
                        </Link>
                        <Link
                          to="/dashboard?tab=sales-report"
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            isActive("/dashboard?tab=sales-report")
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <BarChart className="h-4 w-4" />
                          Sales Report
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            )}
            {currentUser.isAdmin && currentUser.role === "Admin" ? (
              <div>
                <Link
                  to="/dashboard?tab=home-admin"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/dashboard?tab=home-admin")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/dashboard?tab=productions"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/dashboard?tab=productions")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Package className="h-4 w-4" />
                  Productions
                </Link>
                {/* Transactions */}
                <Accordion
                  type="single"
                  collapsible
                  className="w-full rounded-lg"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger
                      className={`flex items-center justify-between px-3 py-2 text-left transition-all ${
                        isActive("item-1")
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Transactions
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <Link
                          to="/dashboard?tab=orders-admin"
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            isActive("/dashboard?tab=orders-admin")
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <Clipboard className="h-4 w-4" />
                          Orders
                        </Link>
                        <Link
                          to="/dashboard?tab=rentals-admin"
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            isActive("/dashboard?tab=rentals-admin")
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <Badge className="h-4 w-4" />
                          Rentals
                        </Link>
                        <Link
                          to="/dashboard?tab=commercial-job-admin"
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            isActive("/dashboard?tab=commercial-job-admin")
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <Building className="h-4 w-4" />
                          Commercial Job
                        </Link>
                        <hr></hr>
                        <Link
                          to="/dashboard?tab=schedules"
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            isActive("/dashboard?tab=schedules")
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <Calendar className="h-4 w-4" />
                          Schedules
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Inventory */}
                <Accordion
                  type="single"
                  collapsible
                  className="w-full rounded-lg"
                >
                  <AccordionItem value="item-2">
                    <AccordionTrigger
                      className={`flex items-center justify-between px-3 py-2 text-left transition-all ${
                        isActive("item-2")
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        Inventory
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <Link
                          to="/dashboard?tab=raw-materials"
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            isActive("/dashboard?tab=raw-materials")
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <Package2Icon className="h-4 w-4" />
                          Raw Materials
                        </Link>
                        <Link
                          to="/dashboard?tab=finished-products"
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            isActive("/dashboard?tab=finished-products")
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <PackageOpen className="h-4 w-4" />
                          Finished Product
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Sales */}
                <Accordion
                  type="single"
                  collapsible
                  className="w-full rounded-lg"
                >
                  <AccordionItem value="item-3">
                    <AccordionTrigger
                      className={`flex items-center justify-between px-3 py-2 text-left transition-all ${
                        isActive("item-2")
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <LineChart className="h-4 w-4" />
                        Reports
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <Link
                          to="/dashboard?tab=accomplishment-report"
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            isActive("/dashboard?tab=accomplishment-report")
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <PieChart className="h-4 w-4" />
                          Accomplishment Report
                        </Link>
                        <Link
                          to="/dashboard?tab=sales-report"
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            isActive("/dashboard?tab=sales-report")
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <BarChart className="h-4 w-4" />
                          Sales Report
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Link
                  to="/dashboard?tab=all-users"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/dashboard?tab=all-users")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Users
                </Link>
                <Link
                  to="/dashboard?tab=system-maintenance"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/dashboard?tab=system-maintenance")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <GearIcon className="h-4 w-4" />
                  System Maintenance
                </Link>
              </div>
            ) : (
              <div>
                {currentUser.role === "Student" && (
                  <>
                    <Link
                      to="/dashboard?tab=orders"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        isActive("/dashboard?tab=orders")
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Clipboard className="h-4 w-4" />
                      Appointments
                    </Link>
                    <Link
                      to="/dashboard?tab=schedules"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        isActive("/dashboard?tab=home")
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Calendar className="h-4 w-4" />
                      Schedules
                    </Link>
                  </>
                )}

                {currentUser.role === "Coordinator" && (
                  <>
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
                  </>
                )}

                {currentUser.role === "CommercialJob" && (
                  <>
                    <Link
                      to="/dashboard?tab=commercial-job"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        isActive("/dashboard?tab=commercial-job")
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Clipboard className="h-4 w-4" />
                      Appointments
                    </Link>
                    <Link
                      to="/dashboard?tab=schedules"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        isActive("/dashboard?tab=home")
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Calendar className="h-4 w-4" />
                      Schedules
                    </Link>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
