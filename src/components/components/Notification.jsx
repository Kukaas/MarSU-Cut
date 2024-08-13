import { useEffect, useState } from "react";
import { SheetDescription, SheetTitle } from "../ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";
import { Tooltip } from "antd";

const Notification = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [readNotifications, setReadNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `https://marsu.cut.server.kukaas.tech/api/v1/user/notifications/${currentUser._id}`
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
        toast.success("Notification marked as read.", {
          action: {
            label: "Ok",
          },
        });

        // Update state
        const updatedUnreadNotifications = unreadNotifications.filter(
          (unreadNotification) => unreadNotification._id !== notification._id
        );
        setUnreadNotifications(updatedUnreadNotifications);
        setReadNotifications([...readNotifications, notification]);

        if (currentUser.isAdmin) {
          navigate("/dashboard?tab=orders-admin");
        }
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
        `https://marsu.cut.server.kukaas.tech/api/v1/user/notifications/${currentUser._id}/${notification._id}`
      );

      if (res.status === 200) {
        toast.success("Notification deleted.", {
          action: {
            label: "Ok",
          },
        });

        // Update state
        const updatedReadNotifications = readNotifications.filter(
          (readNotification) => readNotification._id !== notification._id
        );
        setReadNotifications(updatedReadNotifications);
      } else {
        toast.error("Failed to delete notification.", {
          action: {
            label: "Ok",
          },
        });
      }
    } catch (error) {
      toast.error("Failed to delete notification.", {
        action: {
          label: "Ok",
        },
      });
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/user/notifications/${currentUser._id}`
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
      const res = await axios.delete(
        `https://marsu.cut.server.kukaas.tech/api/v1/user/notifications/${currentUser._id}`
      );

      if (res.status === 200) {
        toast.success("All notifications deleted.");

        // Update state
        setReadNotifications([]);
      } else {
        toast.error("Failed to delete all notifications.");
      }
    } catch (error) {
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
        <TabsContent value="unread">
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
          <Button className="mt-5" onClick={handleMarkAllNotificationsAsRead} unreadNotification={unreadNotifications}>
            {loading ? "Marking..." : "Mark all as read"}
          </Button>
        </TabsContent>
        <TabsContent value="read">
          <SheetTitle className="mt-5">Read</SheetTitle>
          <SheetDescription className="mt-2">
            You have no read notifications.
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
                  <Button variant="destructive" className="mt-2 h-6 w-6 relative" onClick={() => handleDeleteNotification(readNotifications)}>
                    <Trash className="h-4 w-4 absolute"/>
                  </Button>
                </Tooltip>
              </div>
          ))}
          <Button
            className="mt-5"
            variant="destructive"
            onClick={handleDeleteAllNotification}
          >
            Delete all
          </Button>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Notification;
