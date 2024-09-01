// UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Typography } from "antd";

// others
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import axios from "axios";

import { CustomCalendar } from "../../custom-components/CustomCalendar";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";

const DashSchedules = () => {
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=schedules");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/v1/order/schedule/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      const data = response.data.schedules;
      if (Array.isArray(data)) {
        const schedules = data.reduce((acc, schedule) => {
          const date = moment(schedule.schedule).format("YYYY-MM-DD");
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(schedule.studentName);
          return acc;
        }, {});
        setSchedules(schedules);
      }
      setLoading(false);
    };

    fetchSchedules();
  }, []);

  const handleDayClick = (day) => {
    const date = moment(day).format("YYYY-MM-DD");
    if (schedules[date]) {
      setStudents(schedules[date]);
    } else {
      setStudents([]);
    }
    setSelectedDate(date);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDate(null);
    setStudents([]);
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full p-5">
      <Typography.Title level={2} className="text-black dark:text-white">
        Schedules
      </Typography.Title>
      <div className="w-full h-screen flex items-center justify-center overflow-x-auto">
        <Helmet>
          <title>MarSU Cut | Schedules</title>
          <meta name="description" content="" />
        </Helmet>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <CustomCalendar
            mode="single"
            className="w-full h-full"
            schedules={schedules}
            onDayClick={handleDayClick}
          />
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule for {formattedDate}</DialogTitle>
              <DialogDescription className="mt-3 dark:text-white text-black">
                {students.length > 0 ? (
                  <ul>
                    {students.map((student, index) => (
                      <li className="mt-2" key={index}>
                        {student}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2">No students scheduled for this day.</p>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DashSchedules;
