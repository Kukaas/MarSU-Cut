import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import axios from "axios";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const Monthly = () => {
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    const fetchSalesbyMonth = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/sales-report/sales-by-month`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const monthlySales = res.data.monthlySales;

        if (res.status === 200) {
          const transformedData = Object.keys(monthlySales).map((month) => ({
            month,
            ...monthlySales[month],
          }));
          setComparisonData(transformedData);

          // Prepare comparison data
          const currentMonth = transformedData[transformedData.length - 1];
          const previousMonth = transformedData[transformedData.length - 2];

          if (currentMonth && previousMonth) {
            setComparisonData([
              {
                month: previousMonth.month,
                totalRevenue: previousMonth.totalRevenue,
                totalOrders: previousMonth.totalOrders,
              },
              {
                month: currentMonth.month,
                totalRevenue: currentMonth.totalRevenue,
                totalOrders: currentMonth.totalOrders,
              },
            ]);
          }
        }
      } catch (error) {
        console.error(error);
        setComparisonData([]);
      }
    };
    fetchSalesbyMonth();
  }, []);

  const chartConfig = {
    totalRevenue: {
      label: "Total Revenue: ₱",
    },
    totalOrders: {
      label: "Total Orders",
    },
  };

  const formatCurrency = (value) => `₱${value.toLocaleString()}`;

  // Define colors for the bars
  const revenueColor = "#8884d8"; // Blue for totalRevenue
  const ordersColor = "#82ca9d"; // Green for totalOrders

  return (
    <>
      {comparisonData.length > 0 ? (
        <div className="space-y-8">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart data={comparisonData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                dataKey="totalRevenue"
                tickLine={false}
                tickMargin={10}
                tickFormatter={formatCurrency}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="totalRevenue"
                fill={revenueColor}
                radius={5}
                barSize={30}
              />
              <Bar
                dataKey="totalOrders"
                fill={ordersColor}
                radius={5}
                barSize={30}
              />
            </BarChart>
          </ChartContainer>
        </div>
      ) : (
        <div className="min-h-[400px] w-full flex items-center justify-center">
          <p className="text-gray-400 mt-20 text-lg">No data available</p>
        </div>
      )}
    </>
  );
};

export default Monthly;
