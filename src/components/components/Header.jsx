// Ui imports
import { Button } from "../ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Navigation imports
import { Link, useLocation, useNavigate } from "react-router-dom";

// Icons import
import { Home, LogInIcon, Menu, MenuIcon } from "lucide-react";

// Other imports
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "@/redux/user/userSlice";

import { useTheme } from "./ThemProvider";
import { BASE_URL } from "@/lib/api";
import ToasterError from "@/lib/Toaster";
import { toast } from "sonner";
import MenuSmallScreen from "./MenuSmallScreen";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

const Header = () => {
  const { setTheme } = useTheme();
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const isActive = (path) => currentPath === path;

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
      const res = await axios.post(`${BASE_URL}/api/v1/auth/logout`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setIsLoggingOut(false);
        dispatch(logout());
        localStorage.removeItem("token");
        toast.success("Thank you for using our service. Come back soon!");
        navigate("/sign-in");
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="border-b border-solid z-30 border-gray-300 shadow-lg sticky top-0 bg-white dark:bg-slate-900">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {currentUser ? (
          <div
            className="font-bold hover:text-current text-2xl cursor-pointer"
            onClick={() => {
              if (currentUser.isAdmin) {
                navigate("/dashboard?tab=home-admin");
              } else {
                navigate("/dashboard?tab=home");
              }
            }}
          >
            <span
              className="rounded-lg text-white"
              style={{
                background:
                  "linear-gradient(90deg, hsla(48, 80%, 66%, 1) 0%, hsla(0, 100%, 25%, 1) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MarSU
            </span>{" "}
            Cut
          </div>
        ) : (
          <Link to="/" className="font-bold hover:text-current text-2xl">
            <span
              className="rounded-lg text-white"
              style={{
                background:
                  "linear-gradient(90deg, hsla(48, 80%, 66%, 1) 0%, hsla(0, 100%, 25%, 1) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MarSU
            </span>{" "}
            Cut
          </Link>
        )}
        <div className="flex flex-row gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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

          {currentUser && (
            <DropdownMenu className="">
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={currentUser.photo} />
                  <AvatarFallback>
                    {`${currentUser.name.split(" ")[0][0]}${
                      currentUser.name.split(" ").slice(-1)[0][0]
                    }`.toUpperCase()}
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
          {isSmallScreen && currentUser ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-auto">
                <SheetTitle>
                  {" "}
                  <div className="font-bold hover:text-current text-2xl text-center sm:text-left mt-8">
                    <span
                      className="rounded-lg text-white"
                      style={{
                        background:
                          "linear-gradient(90deg, hsla(48, 80%, 66%, 1) 0%, hsla(0, 100%, 25%, 1) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      MarSU
                    </span>{" "}
                    Cut
                  </div>
                </SheetTitle>
                <MenuSmallScreen />
              </SheetContent>
            </Sheet>
          ) : (
            <>
              {isSmallScreen && !currentUser ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <MenuIcon />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader className="mt-10">
                      <Link
                        to="/"
                        className="font-bold hover:text-current text-2xl text-center sm:text-left"
                      >
                        <span
                          className="rounded-lg text-white"
                          style={{
                            background:
                              "linear-gradient(90deg, hsla(48, 80%, 66%, 1) 0%, hsla(0, 100%, 25%, 1) 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          MarSU
                        </span>{" "}
                        Cut
                      </Link>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col gap-5 items-center justify-center mt-5">
                        <SheetTrigger asChild>
                          <Link
                            to="/"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                              isActive("/")
                                ? "bg-muted text-primary w-full flex items-center justify-center"
                                : "text-muted-foreground hover:text-primary"
                            }`}
                          >
                            <Home className="h-4 w-4" />
                            Home
                          </Link>
                        </SheetTrigger>
                        <SheetTrigger asChild>
                          <Link
                            to="/sign-in"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                              isActive("/sign-in")
                                ? "bg-muted text-primary w-full flex items-center justify-center"
                                : "text-muted-foreground hover:text-primary"
                            }`}
                          >
                            <LogInIcon className="h-4 w-4" />
                            Sign in
                          </Link>
                        </SheetTrigger>
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
        </div>
      </div>
    </div>
  );
};

export default Header;
