import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import PropTypes from "prop-types";

const ChartTooltipContent = ({ active, payload, mode }) => {
  if (active && payload && payload.length) {
    const isDarkMode = mode === "dark";
    const tooltipStyles = {
      backgroundColor: isDarkMode ? "#1e293b" : "#f9fafb",
      color: isDarkMode ? "#e2e8f0" : "#1f2937",
      border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
      borderRadius: "10px",
      padding: "12px 16px",
      boxShadow: isDarkMode
        ? "0 4px 12px rgba(0, 0, 0, 0.8)"
        : "0 4px 12px rgba(0, 0, 0, 0.1)",
      minWidth: "180px",
    };

    const labelStyles = {
      margin: "0",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: isDarkMode ? "#cbd5e1" : "#4b5563",
    };

    const valueStyles = {
      margin: "8px 0 0",
      fontSize: "1rem",
      fontWeight: "600",
      color: isDarkMode ? "#f8fafc" : "#111827",
    };

    return (
      <div style={tooltipStyles}>
        <p style={labelStyles}>{payload[0].payload.productType}</p>
        <p style={valueStyles}>
          Current Year Production: <span>{payload[0].value}</span>
        </p>
        <p style={valueStyles}>
          Last Year Production: <span>{payload[1]?.value || 0}</span>
        </p>
      </div>
    );
  }
  return null;
};

ChartTooltipContent.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  mode: PropTypes.string,
};

const ProductionYear = () => {
  const [data, setData] = useState([]);
  const [lastYearData, setLastYearData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          currentGeneralRes,
          lastYearGeneralRes,
          currentAcademicRes,
          lastYearAcademicRes,
        ] = await Promise.all([
          axios.get(`${BASE_URL}/api/v1/production/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/v1/production/all/last-year`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/v1/production/academic/this-year`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/v1/production/academic/all/last-year`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const aggregateData = (data) => {
          return data.reduce((acc, curr) => {
            const { productType, quantity } = curr;
            acc[productType] = (acc[productType] || 0) + quantity;
            return acc;
          }, {});
        };

        const mergeData = (general, academic) => {
          const result = { ...general };
          for (const [productType, quantity] of Object.entries(academic)) {
            result[productType] = (result[productType] || 0) + quantity;
          }
          return Object.entries(result).map(([productType, quantity]) => ({
            productType,
            quantity,
          }));
        };

        const generalCurrentData = aggregateData(
          currentGeneralRes.data.productions
        );
        const academicCurrentData = aggregateData(
          currentAcademicRes.data.productions
        );
        const currentYearData = mergeData(
          generalCurrentData,
          academicCurrentData
        );

        const generalLastYearData = aggregateData(
          lastYearGeneralRes.data.productions
        );
        const academicLastYearData = aggregateData(
          lastYearAcademicRes.data.productions
        );
        const lastYearData = mergeData(
          generalLastYearData,
          academicLastYearData
        );

        setData(currentYearData);
        setLastYearData(lastYearData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const chartData = data.map((item) => {
    const lastYearItem = lastYearData.find(
      (lastYear) => lastYear.productType === item.productType
    );

    return {
      productType: item.productType,
      currentQuantity: item.quantity,
      lastYearQuantity: lastYearItem ? lastYearItem.quantity : 0,
    };
  });

  const chartConfig = {
    currentQuantity: {
      label: "Current Year",
    },
    lastYearQuantity: {
      label: "Last Year",
    },
  };

  const currentQuantityColor = "#8884d8"; // Blue for current year
  const lastYearQuantityColor = "#82ca9d"; // Green for last year

  return (
    <ChartContainer config={chartConfig}>
      {chartData.length > 0 ? (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="productType"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#555" }}
          />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="currentQuantity"
            fill={currentQuantityColor}
            radius={5}
            barSize={30}
            name={chartConfig.currentQuantity.label}
          />
          <Bar
            dataKey="lastYearQuantity"
            fill={lastYearQuantityColor}
            radius={5}
            barSize={30}
            name={chartConfig.lastYearQuantity.label}
          />
        </BarChart>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </ChartContainer>
  );
};

export default ProductionYear;
