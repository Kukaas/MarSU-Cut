import { CustomCalendar } from "../user/CustomCalendar";


const DashSchedules = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <CustomCalendar mode="single" className="w-full h-full" />
    </div>
  );
};

export default DashSchedules;
