import { useState, useEffect, useRef } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import moment from "moment";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";
import { Check, X } from "lucide-react";

const CustomHeader = ({ date, prev, next, setView }) => {
  const formattedDate = new Date(date);
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <button onClick={prev} className="p-2 border rounded">
          &lt;
        </button>
        <h2 className="text-lg font-semibold">
          {formattedDate.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={next} className="p-2 border rounded">
          &gt;
        </button>
      </div>
      <div className="flex space-x-2 mt-2 md:mt-0">
        <button
          onClick={() => setView("dayGridMonth")}
          className="p-2 border rounded"
        >
          Month
        </button>
        <button
          onClick={() => setView("timeGridWeek")}
          className="p-2 border rounded"
        >
          Week
        </button>
        <button
          onClick={() => setView("timeGridDay")}
          className="p-2 border rounded"
        >
          Day
        </button>
      </div>
    </div>
  );
};

CustomHeader.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  prev: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
};

export const CustomCalendar = () => {
  const [schedules, setSchedules] = useState([]);
  const [commercialJobSchedules, setCommercialJobSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [selectedCommercialSchedules, setSelectedCommercialSchedules] =
    useState([]); // State for commercial job schedules
  const [view, setView] = useState("dayGridMonth");
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);

  // Fetch student schedules from the API
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
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
          const formattedSchedules = data.map((schedule) => {
            const date = moment(schedule.schedule).format("YYYY-MM-DD");
            return {
              title: schedule.studentName,
              status: schedule.status,
              start: date,
              allDay: true,
            };
          });
          setSchedules(formattedSchedules);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Fetch commercial job schedules from the API
  useEffect(() => {
    const fetchCommercialJobSchedules = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/commercial-job/schedule/all`,
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
          const formattedSchedules = data.map((schedule) => {
            const date = moment(schedule.schedule).format("YYYY-MM-DD");
            return {
              title: schedule.cbName,
              status: schedule.status,
              start: date,
              allDay: true,
            };
          });
          setCommercialJobSchedules(formattedSchedules);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommercialJobSchedules();
  }, []);

  // Handle date click
  const handleDateClick = (info) => {
    const selectedDateString = info.dateStr;

    // Filter student schedules and commercial job schedules for the selected date
    const schedulesForDate = schedules.filter(
      (schedule) => schedule.start === selectedDateString
    );
    const commercialSchedulesForDate = commercialJobSchedules.filter(
      (schedule) => schedule.start === selectedDateString
    );

    setSelectedDate(selectedDateString);
    setSelectedSchedules(schedulesForDate);
    setSelectedCommercialSchedules(commercialSchedulesForDate); // Set commercial job schedules
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSchedules([]);
    setSelectedCommercialSchedules([]); // Reset commercial job schedules
  };

  const formatDate = (date) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handlePrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setCurrentDate(calendarApi.getDate());
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setCurrentDate(calendarApi.getDate());
  };

  const handleViewChange = (newView) => {
    setView(newView);
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(newView);
    setCurrentDate(calendarApi.getDate());
  };

  return (
    <div className="w-full px-0">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading schedules...</p>
        </div>
      ) : (
        <>
          <CustomHeader
            date={currentDate}
            prev={handlePrev}
            next={handleNext}
            view={view}
            setView={handleViewChange}
          />
          <FullCalendar
            ref={calendarRef}
            height={"85vh"}
            width={"100%"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={[...schedules, ...commercialJobSchedules]} // Show both schedules in calendar
            select={handleDateClick}
            dateClick={handleDateClick}
            headerToolbar={false}
          />
        </>
      )}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="overflow-auto">
          <DialogHeader>
            <DialogTitle>Schedules for {formatDate(selectedDate)}</DialogTitle>
          </DialogHeader>
          <div className="mt-3">
            <h3 className="font-semibold">Student Schedules</h3>
            {selectedSchedules.length > 0 ? (
              <ul>
                {selectedSchedules.map((schedule, index) => (
                  <li key={index} className="mt-2 flex items-center">
                    {schedule.title}
                    {["MEASURED", "CLAIMED", "DONE"].includes(
                      schedule.status
                    ) ? (
                      <Check className="w-4 h-4 text-green-500 ml-3" />
                    ) : (
                      <X className="w-4 h-4 text-red-500 ml-3" />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No student schedules available for this day.</p>
            )}

            <h3 className="font-semibold mt-4">Commercial Job Schedules</h3>
            {selectedCommercialSchedules.length > 0 ? (
              <ul>
                {selectedCommercialSchedules.map((schedule, index) => (
                  <li key={index} className="mt-2">
                    {schedule.title}
                    {["MEASURED", "CLAIMED", "DONE"].includes(
                      schedule.status
                    ) ? (
                      <Check className="w-4 h-4 text-green-500 ml-3" />
                    ) : (
                      <X className="w-4 h-4 text-red-500 ml-3" />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No commercial job schedules available for this day.</p>
            )}
          </div>

          <DialogClose asChild>
            <Button variant="secondary" className="mt-2">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomCalendar;
