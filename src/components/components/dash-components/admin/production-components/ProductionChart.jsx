import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";

const ProductionChart = () => {
  const [data, setData] = useState([]);
  const [lastYearData, setLastYearData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currentYearRes, lastYearRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/v1/production/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/v1/production/all/last-year`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const rawData = currentYearRes.data.productions;
        const lastYearRawData = lastYearRes.data.productions;
        const aggregatedData = aggregateData(rawData);
        const aggregatedLastYearData = aggregateData(lastYearRawData);

        setData(aggregatedData);
        setLastYearData(aggregatedLastYearData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const aggregateData = (data) => {
    const result = data.reduce((acc, curr) => {
      const { productType, quantity } = curr;
      if (acc[productType]) {
        acc[productType] += quantity;
      } else {
        acc[productType] = quantity;
      }
      return acc;
    }, {});

    return Object.entries(result).map(([productType, quantity]) => ({
      productType,
      quantity,
    }));
  };

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

  // Define colors for the bars
  const currentQuantityColor = "#8884d8"; // Blue for current year quantity
  const lastYearQuantityColor = "#82ca9d"; // Green for last year quantity

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

export default ProductionChart;
