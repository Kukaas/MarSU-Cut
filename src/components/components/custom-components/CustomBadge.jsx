import PropTypes from "prop-types";

const CustomBadge = ({ color, badgeText }) => {
  return (
    <div className="status-badge">
      <div className="size-2 rounded-full" style={{ backgroundColor: color }} />
      <p className="text-[12px] font-semibold" style={{ color }}>
        {badgeText}
      </p>
    </div>
  );
};

CustomBadge.propTypes = {
  color: PropTypes.string,
  badgeText: PropTypes.string,
};

export default CustomBadge;
