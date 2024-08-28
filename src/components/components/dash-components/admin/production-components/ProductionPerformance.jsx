import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";

const ProductionPerformance = () => {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        const [thisMonthRes, lastMonthRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/v1/production/this-month`, { headers }),
          axios.get(`${BASE_URL}/api/v1/production/last-month`, { headers }),
        ]);

        const thisMonthData = thisMonthRes.data;
        const lastMonthData = lastMonthRes.data;

        if (thisMonthData.success && lastMonthData.success) {
          const combinedData = [
            { name: "This Month", value: thisMonthData.totalQuantity },
            { name: "Last Month", value: lastMonthData.totalQuantity },
          ];

          setData(combinedData);
          setLoading(false);
        } else {
          console.error("Error: API response does not indicate success");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartConfig = {
    title: "Production Performance",
    subtitle: "This Month vs Last Month",
  };

  const currentMonthColor = "#8884d8";
  const lastMonthColor = "#82ca9d";

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`Value ${value}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  return (
    <div>
      {loading ? (
        <div className="w-full h-full">
          <div className="flex justify-center items-center w-full h-full">
            <Loader2 size="100" className="animate-spin" />
          </div>
        </div>
      ) : (
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.name === "This Month"
                        ? currentMonthColor
                        : lastMonthColor
                    }
                  />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  );
};

ProductionPerformance.propTypes = {
  data: PropTypes.array,
  cx: PropTypes.string,
  cy: PropTypes.string,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  fill: PropTypes.string,
  dataKey: PropTypes.string,
  onMouseEnter: PropTypes.func,
  activeIndex: PropTypes.number,
  activeShape: PropTypes.func,
  name: PropTypes.string,
  payload: PropTypes.object,
  percent: PropTypes.number,
  value: PropTypes.number,
  RADIAN: PropTypes.number,
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  midAngle: PropTypes.number,
};

export default ProductionPerformance;
