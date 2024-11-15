// UI
import { SheetDescription, SheetTitle } from "../ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { toast, Toaster } from "sonner";

// icons
import { Loader2, Trash } from "lucide-react";

// others
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Tooltip } from "antd";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import ToasterError from "@/lib/Toaster";
import { formatDistanceToNow } from "date-fns";
import { Input } from "../ui/input";

const Notification = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [readNotifications, setReadNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
      setLoading(true);
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
        setLoading(false);
        toast.success("All notifications marked as read.");

        // Update state
        setReadNotifications([...readNotifications, ...unreadNotifications]);
        setUnreadNotifications([]);
      } else {
        toast.error("Failed to mark all notifications as read.");
        setLoading(false);
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
      setLoading(false);
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
          {filteredUnreadNotifications
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
            ))}
          <Button
            className="mt-5"
            onClick={handleMarkAllNotificationsAsRead}
            unreadNotification={unreadNotifications}
            disabled={loading}
          >
            {loading ? (
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
          {filteredReadNotifications
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
            ))}
        </TabsContent>
        <Toaster position="top-center" richColors closeButton />
      </Tabs>
    </>
  );
};

export default Notification;
