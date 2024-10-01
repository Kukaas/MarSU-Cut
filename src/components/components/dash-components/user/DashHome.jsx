import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CustomCalendar } from "../../custom-components/CustomCalendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DashHome = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=home-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

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

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full min-h-screen p-5 overflow-x-auto">
      <div className="w-full h-screen flex items-center justify-center overflow-x-auto">
        <Helmet>
          <title>MarSU Cut | Dashboard</title>
          <meta name="description" content="" />
        </Helmet>

        {loading ? (
          <div>Loading...</div>
        ) : currentUser.role === "Student" || currentUser.role === "CommercialJob" ? (
          <CustomCalendar
            mode="single"
            className="w-full h-full"
            schedules={schedules}
            onDayClick={handleDayClick}
          />
        ) : (
          <p>Dashboard</p>
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

export default DashHome;
