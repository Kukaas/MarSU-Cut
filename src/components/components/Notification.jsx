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

const Notification = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [readNotifications, setReadNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `https://marsu.cut.server.kukaas.tech/api/v1/user/notifications/${currentUser._id}`,
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
        `https://marsu.cut.server.kukaas.tech/api/v1/user/notifications/${currentUser._id}/${notification._id}`
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
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleDeleteNotification = async (notification) => {
    try {
      const res = await axios.delete(
        `https://marsu.cut.server.kukaas.tech/api/v1/user/notifications/${currentUser._id}/${notification._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success("Notification deleted.", {
          description: `Notification with ID "${notification._id}" has been deleted.`,
        });

        // Update state
        const updatedReadNotifications = readNotifications.filter(
          (readNotification) => readNotification._id !== notification._id
        );
        setReadNotifications(updatedReadNotifications);
      } else {
        toast.error("Failed to delete notification.", {});
      }
    } catch (error) {
      toast.error("Failed to delete notification.", {});
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/user/notifications/${currentUser._id}`,
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
      toast.error("Failed to mark all notifications as read.");
      setLoading(false);
    }
  };

  const handleDeleteAllNotification = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `https://marsu.cut.server.kukaas.tech/api/v1/user/notifications/${currentUser._id}`,
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
        toast.success("All notifications deleted.");

        // Update state
        setReadNotifications([]);
      } else {
        setLoading(false);
        toast.error("Failed to delete all notifications.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to delete all notifications.");
    }
  };

  return (
    <>
      <Tabs defaultValue="unread" className="mt-5">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
        <TabsContent value="unread" className="h-screen overflow-auto">
          <SheetTitle className="mt-5">Unread</SheetTitle>
          <SheetDescription className="mt-2">
            {unreadNotifications.length === 0
              ? "You have no unread notifications."
              : unreadNotifications.length === 1
              ? "You have 1 unread notification."
              : `You have ${unreadNotifications.length} unread notifications.`}
          </SheetDescription>
          {unreadNotifications.map((unreadNotifications) => (
            <div
              key={unreadNotifications.id}
              className="p-4 border rounded-md border-gray-400 mt-2 cursor-pointer"
              onClick={() => {
                handleReadNotification(unreadNotifications);
              }}
            >
              <SheetTitle>{unreadNotifications?.title}</SheetTitle>
              <SheetDescription>
                {unreadNotifications?.message}
              </SheetDescription>
              <SheetDescription className="text-xs text-gray-400">
                {unreadNotifications?.createdAt}
              </SheetDescription>
            </div>
          ))}
          <Button
            className="mt-5"
            onClick={handleMarkAllNotificationsAsRead}
            unreadNotification={unreadNotifications}
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
        <TabsContent value="read" className="h-screen overflow-x-auto">
          <SheetTitle className="mt-5">Read</SheetTitle>
          <SheetDescription className="mt-2">
            {readNotifications.length === 0
              ? "You have no read notifications."
              : readNotifications.length === 1
              ? "You have 1 read notification."
              : `You have ${readNotifications.length} read notifications.`}
          </SheetDescription>
          {readNotifications.map((readNotifications) => (
            <div
              key={readNotifications.id}
              className="p-4 border rounded-md border-gray-400 mt-2 overflow-x-auto cursor-pointer"
            >
              <div className="flex gap-2 flex-col">
                <SheetTitle className="text-sm">
                  {readNotifications?.title}
                </SheetTitle>
                <SheetDescription className="text-sm">
                  {readNotifications?.message}
                </SheetDescription>
                <SheetDescription className="text-xs text-gray-400">
                  {readNotifications?.createdAt}
                </SheetDescription>
              </div>
              <Tooltip title="Delete notification">
                <Button
                  variant="destructive"
                  className="mt-2 h-6 w-6 relative"
                  onClick={() => handleDeleteNotification(readNotifications)}
                >
                  <Trash className="h-4 w-4 absolute" />
                </Button>
              </Tooltip>
            </div>
          ))}
          <Button
            className="mt-5"
            variant="destructive"
            onClick={handleDeleteAllNotification}
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 animate-spin" />
                <span>Deleting</span>
              </div>
            ) : (
              "Delete all"
            )}
          </Button>
        </TabsContent>
        <Toaster position="top-center" richColors cloeButton />
      </Tabs>
    </>
  );
};

export default Notification;
