import { Input } from "../../ui/input";
import { Tooltip } from "antd";
import { ArchiveIcon } from "lucide-react";
import { Button } from "../../ui/button";
import PropTypes from "prop-types";
import StatusFilter from "./StatusFilter";

const DataTableToolBar = ({
  searchValue,
  setSearchValue,
  handleStatusChange,
  statusFilter,
  navigate,
  status,
  placeholder,
  title,
  name
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between pb-2">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-8 w-[270px]"
        />
        <StatusFilter
          status={status}
          handleStatusChange={handleStatusChange}
          statusFilter={statusFilter}
        />
      </div>
      <Tooltip title={title}>
        <Button className="m-2 h-8" onClick={navigate}>
          <ArchiveIcon size={20} className="mr-2 h-4 w-4" />
          {name}
        </Button>
      </Tooltip>
    </div>
  );
};

DataTableToolBar.propTypes = {
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default DataTableToolBar;
