import { Calendar } from "@/components/ui/calendar";

const DashSchedules = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Calendar mode="single" className="rounded-md border shadow" />
    </div>
  );
};

export default DashSchedules;
