import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import axios from "axios";
import { useEffect, useState } from "react";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";

const Overview = () => {
  const [overview, setOverview] = useState([]);

  useEffect(() => {
    const fetchSalesOverView = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/sales-report/overview`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const data = res.data.data;

        if (res.status === 200) {
          setOverview(data);
        }
      } catch (error) {
        console.log(error);
        return [];
      }
    };
    fetchSalesOverView();
  }, []);

  const chartData = overview.map((item) => ({
    productType: item.productType,
    currentMonthSales: item.currentMonthSales,
    lastMonthSales: item.lastMonthSales,
  }));

  const getCurrentMonthYear = () => {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const getLastMonthYear = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const chartConfig = {
    currentMonthSales: {
      label: `${getCurrentMonthYear()}`,
    },
    lastMonthSales: {
      label: `${getLastMonthYear()}`,
    },
  };

  // Define colors for the bars
  const currentMonthColor = "#8884d8"; // Blue for current month sales
  const lastMonthColor = "#82ca9d"; // Green for last month sales

  return (
    <>
      {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="productType"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="currentMonthSales"
              fill={currentMonthColor}
              radius={3}
            />
            <Bar dataKey="lastMonthSales" fill={lastMonthColor} radius={3} />
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="min-h-[200px] w-full flex items-center justify-center">
          <p className="text-gray-400 mt-20 text-lg">No data available</p>
        </div>
      )}
    </>
  );
};

export default Overview;
