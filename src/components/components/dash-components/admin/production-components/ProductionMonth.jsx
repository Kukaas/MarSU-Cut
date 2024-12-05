import { useEffect, useState } from "react";
import axios from "axios";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { token } from "@/lib/token";
import { ChartTooltip } from "@/components/ui/chart";
import { BASE_URL } from "@/lib/api";
import PropTypes from "prop-types";

const Legend = ({ productTypes, productColors }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {productTypes.map((productType) => (
        <div key={productType} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: productColors[productType] || "#8884d8" }}
          ></div>
          <p className="text-xs">{productType}</p>
        </div>
      ))}
    </div>
  );
};

Legend.propTypes = {
  productTypes: PropTypes.array,
  productColors: PropTypes.object,
};

const TooltipContent = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md text-black">
        <p className="text-lg font-semibold">{label}</p>
        <div className="flex flex-col gap-2 p-5">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{ backgroundColor: item.stroke }}
              ></div>
              <p className="text-sm">
                {item.name}: {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

TooltipContent.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

const ProductionMonth = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productTypes, setProductTypes] = useState([]);
  const [productColors, setProductColors] = useState({});

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from all three sources
        const [productionResponse, academicResponse, otherResponse] =
          await Promise.all([
            axios.get(`${BASE_URL}/api/v1/production/all/this-month`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(
              `${BASE_URL}/api/v1/production/academic/production-by-month`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
            axios.get(
              `${BASE_URL}/api/v1/production/other/production-by-month`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
          ]);

        if (
          productionResponse.data.success &&
          academicResponse.data.success &&
          otherResponse.data.success
        ) {
          const productionData = productionResponse.data.data;
          const academicData = academicResponse.data.data;
          const otherData = otherResponse.data.data;

          // Combine all data into one array
          const rawData = [...productionData, ...academicData, ...otherData];

          // Extract product types dynamically from the data
          const extractedProductTypes = [
            ...new Set(
              rawData.flatMap((item) =>
                Object.keys(item).filter((key) => key !== "month")
              )
            ),
          ];

          // Dynamically set product colors
          const dynamicProductColors = extractedProductTypes.reduce(
            (acc, productType, index) => {
              // Assign different color for each product type (this is an example, customize as needed)
              acc[productType] = `hsl(${(index * 50) % 360}, 70%, 60%)`;
              return acc;
            },
            {}
          );

          setProductTypes(extractedProductTypes);
          setProductColors(dynamicProductColors);

          // Merge all data into a single object grouped by month
          const mergedData = rawData.reduce((acc, item) => {
            const monthIndex = parseInt(item.month.split("-")[1], 10) - 1;
            const monthName = monthNames[monthIndex];

            // Find existing entry for this month
            const monthData = acc.find((data) => data.name === monthName);

            if (monthData) {
              // Add product quantities to existing month entry
              extractedProductTypes.forEach((productType) => {
                monthData[productType] = monthData[productType] || 0;
                monthData[productType] += item[productType] || 0;
              });
            } else {
              // Add a new entry for this month if it doesn't exist
              const newMonthData = { name: monthName };
              extractedProductTypes.forEach((productType) => {
                newMonthData[productType] = item[productType] || 0;
              });
              acc.push(newMonthData);
            }

            return acc;
          }, []);

          // Ensure all months are represented, even if no data for certain months
          const fullData = monthNames.map((month) => {
            const existingMonthData = mergedData.find(
              (item) => item.name === month
            );
            return (
              existingMonthData || {
                name: month,
                ...extractedProductTypes.reduce((acc, productType) => {
                  acc[productType] = 0;
                  return acc;
                }, {}),
              }
            );
          });

          setData(fullData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ width: "100%", height: 400 }} className="p-5">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickFormatter={(month) => month}
            tick={{ fontSize: 11 }}
            tickMargin={10}
          />
          <YAxis tick={{ fontSize: 10 }} tickMargin={10} />
          <ChartTooltip content={<TooltipContent />} />
          <Legend productTypes={productTypes} productColors={productColors} />
          {productTypes.map((productType) => (
            <Line
              key={productType}
              type="monotone"
              dataKey={productType}
              stroke={productColors[productType] || "#8884d8"}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductionMonth;
