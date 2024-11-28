// UI
import { SheetDescription, SheetTitle } from "../ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { toast, Toaster } from "sonner";

// icons
import { Loader2 } from "lucide-react";

// others
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import ToasterError from "@/lib/Toaster";
import { formatDistanceToNow } from "date-fns";
import { Input } from "../ui/input";
import CardLoading from "./custom-components/CardLoading";

const Notification = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [readNotifications, setReadNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [loadingRead, setLoadingRead] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
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

          // Filter notifications
          const read = notifications.filter(
            (notification) => notification.read
          );
          const unread = notifications.filter(
            (notification) => !notification.read
          );

          // Update state
          setReadNotifications(read);
          setUnreadNotifications(unread);
          setLoading(false);
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

  const handleReadNotification = async (notification) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/v1/user/notifications/${currentUser._id}/${notification._id}`
      );

      if (res.status === 200) {
        toast.success("Notification marked as read.", {});

        // Update state
        const updatedUnreadNotifications = unreadNotifications.filter(
          (unreadNotification) => unreadNotification._id !== notification._id
        );
        setUnreadNotifications(updatedUnreadNotifications);
        setReadNotifications([...readNotifications, notification]);
      } else {
        toast.error("Failed to mark notification as read.");
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    try {
     setLoadingRead(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/user/notifications/${currentUser._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setLoadingRead(false);
        toast.success("All notifications marked as read.");

        // Update state
        setReadNotifications([...readNotifications, ...unreadNotifications]);
        setUnreadNotifications([]);
      } else {
        toast.error("Failed to mark all notifications as read.");
        setLoadingRead(false);
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
      setLoadingRead(false);
    }
  };

  // Filter notifications based on the search query
  const filteredUnreadNotifications = unreadNotifications.filter(
    (notification) =>
      (notification.title && notification.title.toLowerCase().includes(searchValue.toLowerCase())) ||
      (notification.message && notification.message.toLowerCase().includes(searchValue.toLowerCase())) ||
      (notification.createdAt && notification.createdAt.toLowerCase().includes(searchValue.toLowerCase()))
  );

  const filteredReadNotifications = readNotifications.filter(
    (notification) =>
      (notification.title && notification.title.toLowerCase().includes(searchValue.toLowerCase())) ||
      (notification.message && notification.message.toLowerCase().includes(searchValue.toLowerCase())) ||
      (notification.createdAt && notification.createdAt.toLowerCase().includes(searchValue.toLowerCase()))
  );
  return (
    <>
      <Tabs defaultValue="unread" className="mt-5">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
        <div className="mt-3 w-full">
          <Input
            className="w-full"
            placeholder="Search notifications"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)} // Update the search query
          />
        </div>
        <TabsContent
          value="unread"
          className="h-screen overflow-auto hide-scrollbar"
        >
          <SheetTitle className="mt-5">Unread</SheetTitle>
          <SheetDescription className="mt-2">
            {unreadNotifications.length === 0
              ? "You have no unread notifications."
              : unreadNotifications.length === 1
              ? "You have 1 unread notification."
              : `You have ${unreadNotifications.length} unread notifications.`}
          </SheetDescription>
          {loading ? (
            <div className="mt-5 flex flex-col gap-4">
              <CardLoading />
              <CardLoading />
              <CardLoading />
              <CardLoading />
            </div>
          ) : (
            filteredUnreadNotifications
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort in descending order
              .map((notification) => (
                <div
                  key={notification._id}
                  className="p-4 border rounded-md border-gray-400 mt-2 cursor-pointer"
                  onClick={() => handleReadNotification(notification)}
                >
                  <SheetTitle>{notification?.title}</SheetTitle>
                  <SheetDescription>{notification?.message}</SheetDescription>
                  <SheetDescription className="text-xs text-gray-400">
                    {notification?.createdAt} -{" "}
                    {formatDistanceToNow(new Date(notification.createdAt))} ago
                  </SheetDescription>
                </div>
              ))
          )}
          <Button
            className="mt-5"
            onClick={handleMarkAllNotificationsAsRead}
            unreadNotification={unreadNotifications}
            disabled={loadingRead}
          >
            {loadingRead ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 animate-spin" />
                <span>Marking as read</span>
              </div>
            ) : (
              "Mark all as read"
            )}
          </Button>
        </TabsContent>
        <TabsContent
          value="read"
          className="h-screen overflow-auto hide-scrollbar"
        >
          <SheetTitle className="mt-5">Read</SheetTitle>
          <SheetDescription className="mt-2">
            {readNotifications.length === 0
              ? "You have no read notifications."
              : readNotifications.length === 1
              ? "You have 1 read notification."
              : `You have ${readNotifications.length} read notifications.`}
          </SheetDescription>
          {loading ? (<div className="mt-5 flex flex-col gap-4">
              <CardLoading />
              <CardLoading />
              <CardLoading />
              <CardLoading />
            </div>) : (
            filteredReadNotifications
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort in descending order
              .map((notification) => (
                <div
                  key={notification._id}
                  className="p-4 border rounded-md border-gray-400 mt-2 cursor-pointer"
                >
                  <SheetTitle>{notification?.title}</SheetTitle>
                  <SheetDescription>{notification?.message}</SheetDescription>
                  <SheetDescription className="text-xs text-gray-400">
                    {notification?.createdAt} -{" "}
                    {formatDistanceToNow(new Date(notification.createdAt))} ago
                  </SheetDescription>
                </div>
              ))
          )}
        </TabsContent>
        <Toaster position="top-center" richColors closeButton />
      </Tabs>
    </>
  );
};

export default Notification;
