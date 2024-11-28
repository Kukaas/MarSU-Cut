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
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const CustomHeader = ({ date, prev, next }) => {
  const formattedDate = new Date(date);
  return (
    <div className="flex flex-col md:flex-row justify-center items-center mb-6">
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

const Loading = () => (
  <div className="flex flex-col space-y-6 p-4 w-full">
    <div className="grid grid-cols-7 gap-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
        <Skeleton key={index} className="h-6 w-full text-center" />
      ))}
    </div>

    <div className="grid grid-cols-7 gap-2 mt-2">
      {Array.from({ length: 42 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full rounded-md" />
      ))}
    </div>
  </div>
);

export const CustomCalendar = () => {
  const [schedules, setSchedules] = useState([]);
  const [commercialJobSchedules, setCommercialJobSchedules] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [selectedCommercialSchedules, setSelectedCommercialSchedules] =
    useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState("dayGridMonth");
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);

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
              userId: schedule.studentId,
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
              userId: schedule.cbId,
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

  const getVisibleSchedules = () => {
    if (currentUser.isAdmin) {
      return [...schedules, ...commercialJobSchedules]; // Admin sees all schedules
    } else {
      return schedules.map((schedule) => {
        if (schedule.title === currentUser.name) {
          return { ...schedule, title: schedule.title };
        } else {
          return { ...schedule, title: "Occupied" };
        }
      });
    }
  };

  const handleDateClick = (info) => {
    const selectedDateString = info.dateStr;
    const schedulesForDate = schedules.filter(
      (schedule) => schedule.start === selectedDateString
    );
    const commercialSchedulesForDate = commercialJobSchedules.filter(
      (schedule) => schedule.start === selectedDateString
    );

    setSelectedDate(selectedDateString);
    setSelectedSchedules(schedulesForDate);
    setSelectedCommercialSchedules(commercialSchedulesForDate);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handlePrev = () => {
    calendarRef.current.getApi().prev();
    setCurrentDate(calendarRef.current.getApi().getDate());
  };

  const handleNext = () => {
    calendarRef.current.getApi().next();
    setCurrentDate(calendarRef.current.getApi().getDate());
  };

  const handleViewChange = (view) => {
    setView(view);
  };

  return (
    <div className="w-full px-0">
      <CustomHeader
        date={currentDate}
        prev={() => handlePrev()}
        next={() => handleNext()}
        view={view}
        setView={handleViewChange}
      />
      {loading ? (
        <Loading />
      ) : (
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
          events={getVisibleSchedules()}
          dateClick={handleDateClick}
          headerToolbar={false}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-h-[450px] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              Schedules for {moment(selectedDate).format("MMMM DD, YYYY")}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3">
            <h3 className="font-semibold">Student Schedules</h3>
            {currentUser.isAdmin ? (
              <div className="mt-3">
                {selectedSchedules.length > 0 ? (
                  <ul>
                    {selectedSchedules.map((schedule, index) => (
                      <li key={index} className="mt-2 flex items-center">
                        {schedule.title}{" "}
                        {/* Display all schedules for admins */}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No student schedules found.</p>
                )}
              </div>
            ) : currentUser.role === "Student" ? (
              <div className="mt-3">
                {selectedSchedules.length > 0 ? (
                  <ul>
                    {selectedSchedules.map((schedule, index) => (
                      <li key={index} className="mt-2 flex items-center">
                        {schedule.title === currentUser.name
                          ? schedule.title // Show current user's name if it's their schedule
                          : "Occupied"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No student schedules found.</p>
                )}
              </div>
            ) : (
              <p>No student schedule available for this date.</p>
            )}

            <h3 className="mt-6 font-semibold">Commercial Job Schedules</h3>
            {currentUser.isAdmin ? (
              <div className="mt-3">
                {selectedCommercialSchedules.length > 0 ? (
                  <ul>
                    {selectedCommercialSchedules.map((schedule, index) => (
                      <li key={index} className="mt-2 flex items-center">
                        {schedule.title}{" "}
                        {/* Show all commercial job schedules for admins */}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No commercial job schedules found.</p>
                )}
              </div>
            ) : currentUser.role === "CommercialJob" ? (
              <div className="mt-3">
                {selectedCommercialSchedules.length > 0 ? (
                  <ul>
                    {selectedCommercialSchedules.map((schedule, index) => (
                      <li key={index} className="mt-2 flex items-center">
                        {schedule.title === currentUser.name
                          ? schedule.title // Show current commercial job user's name if it's their schedule
                          : "Occupied"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No commercial job schedules found.</p>
                )}
              </div>
            ) : (
              <p>No commercial job schedule available for this date.</p>
            )}

            <div className="mt-6 flex w-full">
              <DialogClose asChild>
                <Button className="w-full">Close</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomCalendar;
