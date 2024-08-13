import { Button } from "../ui/button";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { Bell, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemProvider";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import axios from "axios";
import { logout } from "@/redux/user/userSlice";
import { message } from "antd";

import MenuAdmin from "./MenuAdmin";
import MenuUser from "./MenuUser";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import Notification from "./Notification";

const Header = () => {
  const { setTheme } = useTheme();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const fetchNotifications = async () => {
        try {
          const res = await axios.get(
            `https://marsu.cut.server.kukaas.tech/api/v1/user/notifications/${currentUser?._id}`
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
    }
  }, [currentUser?._id, currentUser]);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 771);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Logout
  const handleLogout = async (event) => {
    try {
      event.preventDefault(); // Prevent default button action
      event.stopPropagation(); // Stop event from propagating and closing the dropdown
      setIsLoggingOut(true);
      const res = await axios.post(
        "https://marsu.cut.server.kukaas.tech/api/v1/auth/logout",
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setIsLoggingOut(false);
        dispatch(logout());
        localStorage.removeItem("token");
        message.success("Thank you for using our service. Come back soon!");
        navigate("/sign-in");
      }
    } catch (error) {
      message.error("Something went wrong");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="border-b border-solid z-30 border-gray-300 shadow-lg sticky top-0 bg-white dark:bg-slate-900">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-2xl">
            <span className="px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              MarSU
            </span>{" "}
            Cut
          </h1>
        </Link>
        <div className="flex flex-row gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-5">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
                <DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
                <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
                <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {currentUser && isSmallScreen && (
            <Sheet>
              <SheetTrigger>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 relative"
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
              <SheetContent>
                <Notification />
              </SheetContent>
            </Sheet>
          )}

          {currentUser && (
            <DropdownMenu className="">
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={currentUser.photo} />
                  <AvatarFallback>
                    {`${currentUser.name.split(" ")[0][0]}${
                      currentUser.name.split(" ").slice(-1)[0][0]
                    }`}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-5">
                <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs text-gray-600 mt-[-10px] dark:text-gray-400">
                  {currentUser.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate(`/dashboard?tab=profile`);
                    }}
                  >
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? "Logging Out..." : "Logout"}
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Admin */}
          {isSmallScreen && currentUser && currentUser.isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-5">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <MenuAdmin />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {isSmallScreen && !currentUser ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Menu</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader className="mt-10">
                      <Link
                        to="/"
                        className="font-bold hover:text-current text-3xl text-center sm:text-left"
                      >
                        <span className="px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                          MarSU
                        </span>{" "}
                        Cut
                      </Link>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col gap-5 items-center justify-center mt-5">
                        <NavLink
                          to="/"
                          className={({ isActive }) =>
                            isActive
                              ? "border-b-2 border-blue-500"
                              : "border-b border-gray-300"
                          }
                        >
                          <SheetClose>Home</SheetClose>
                        </NavLink>

                        <NavLink
                          to="/sign-in"
                          className={({ isActive }) =>
                            isActive
                              ? "border-b-2 border-blue-500"
                              : "border-b border-gray-300"
                          }
                        >
                          <SheetClose>Signin</SheetClose>
                        </NavLink>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <>
                  {!currentUser && (
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem className="mr-3">
                          <Button variant="outline" classNames="p-3">
                            <Link to="/">Home</Link>
                          </Button>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <Button variant="default" classNames="p-3">
                            <Link to="/sign-in">Signin</Link>
                          </Button>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  )}
                </>
              )}
            </>
          )}

          {/* User */}
          {isSmallScreen && currentUser?.isAdmin === false && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Menu />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-5">
                  <DropdownMenuLabel>Menu</DropdownMenuLabel>
                  <MenuUser />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
