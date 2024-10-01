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

const CustomHeader = ({ date, prev, next, setView }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <button onClick={prev} className="p-2 border rounded">
          &lt;
        </button>
        <h2 className="text-lg font-semibold">
          {date.toLocaleDateString("default", {
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
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [view, setView] = useState("dayGridMonth"); // State to track current view
  const [currentDate, setCurrentDate] = useState(new Date()); // State to track the current date
  const calendarRef = useRef(null); // Ref to access the FullCalendar instance

  // Fetch schedules from the API
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

  const handleDateClick = (info) => {
    const selectedDateString = info.dateStr; // Use dateStr from the dateClick event

    const schedulesForDate = schedules.filter(
      (schedule) => schedule.start === selectedDateString
    );

    setSelectedDate(selectedDateString);
    setSelectedSchedules(schedulesForDate);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSchedules([]);
  };

  const formatDate = (date) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handlePrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev(); // Go to previous view
    setCurrentDate(calendarApi.getDate()); // Update currentDate to the new date
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next(); // Go to next view
    setCurrentDate(calendarApi.getDate()); // Update currentDate to the new date
  };

  const handleViewChange = (newView) => {
    setView(newView);
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(newView); // Change the view in the calendar
    setCurrentDate(calendarApi.getDate()); // Update currentDate to reflect the new view's start date
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
            date={currentDate} // Pass the current date
            prev={handlePrev} // Update previous date
            next={handleNext} // Update next date
            view={view}
            setView={handleViewChange} // Use the handler to change view
          />
          <FullCalendar
            ref={calendarRef} // Attach the ref to the FullCalendar instance
            height={"85vh"}
            width={"100%"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={schedules}
            select={handleDateClick} // Maintain select for range selection
            dateClick={handleDateClick} // Add dateClick event
            headerToolbar={false} // Disable the default header
            // Ensure to update currentDate when FullCalendar's date changes
            datesSet={(dateInfo) => {
              setCurrentDate(dateInfo.start); // Update currentDate when the view changes
            }}
          />
        </>
      )}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedules for {formatDate(selectedDate)}</DialogTitle>
          </DialogHeader>
          <div className="mt-3">
            {selectedSchedules.length > 0 ? (
              <ul>
                {selectedSchedules.map((schedule, index) => (
                  <li key={index} className="mt-2">
                    {schedule.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No schedules available for this day.</p>
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

