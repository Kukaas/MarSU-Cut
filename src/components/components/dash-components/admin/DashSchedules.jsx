import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { CustomCalendar } from "./CustomCalendar";

const DashSchedules = () => {
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      const response = await axios.get(
        "https://garments.kukaas.tech/api/v1/order/schedule/all"
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

  return (
    <div className="w-full h-screen flex items-center justify-center">
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
            <DialogTitle>Schedule for {selectedDate}</DialogTitle>
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
  );
};

export default DashSchedules;