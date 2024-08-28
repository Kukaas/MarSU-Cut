import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import PropTypes from "prop-types";

const StatusFilter = ({ statusFilter, handleStatusChange, status }) => {
  // Convert status object values to an array for mapping
  const statusOptions = Object.values(status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-2">
          <div className="flex justify-between items-center">
            {statusFilter
              ? statusFilter === "All"
                ? "Status Filter"
                : statusFilter
              : "Status Filter"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Status Filter</DropdownMenuLabel>
        <DropdownMenuItem key="all" onClick={() => handleStatusChange("All")}>
          All
        </DropdownMenuItem>
        {statusOptions.map((statusOption) => (
          <DropdownMenuItem
            key={statusOption}
            onClick={() => handleStatusChange(statusOption)}
          >
            {statusOption}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

StatusFilter.propTypes = {
  statusFilter: PropTypes.string,
  handleStatusChange: PropTypes.func,
  status: PropTypes.object,
};

export default StatusFilter;
