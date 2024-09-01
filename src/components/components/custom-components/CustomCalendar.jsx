import { DayPicker } from "react-day-picker";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function CustomCalendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-full h-full p-3", className)}
      classNames={{
        months: "flex flex-col h-full",
        month: "flex flex-col flex-1",
        caption:
          "flex justify-between items-center py-2 px-4 relative text-3xl font-bold",
        caption_label: "text-3xl font-bold",
        nav: "flex items-center gap-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "ml-2",
        nav_button_next: "mr-2",
        table: "w-full border-collapse flex-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-full font-normal text-xl flex-1 text-center",
        row: "flex w-full mt-2",
        cell: "h-20 w-full text-center text-xl p-0 relative flex items-center justify-center flex-1 cursor-pointer",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-20 w-full p-0 font-normal aria-selected:opacity-100 flex items-center justify-center"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}

CustomCalendar.displayName = "CustomCalendar";

CustomCalendar.propTypes = {
  className: PropTypes.string,
  classNames: PropTypes.object,
  showOutsideDays: PropTypes.bool,
};

export { CustomCalendar };
