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

const Yearly = () => {
  const [comparisonData, setComparisonData] = useState([]);

  const fetchSalesbyYear = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/sales-report/sales-by-year`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const yearlySales = res.data.yearlySales;

      if (res.status === 200) {
        const transformedData = Object.keys(yearlySales).map((year) => ({
          year,
          ...yearlySales[year],
        }));
        setComparisonData(transformedData);

        // Prepare comparison data
        const currentYear = transformedData[transformedData.length - 1];
        const previousYear = transformedData[transformedData.length - 2];

        if (currentYear && previousYear) {
          setComparisonData([
            {
              year: previousYear.year,
              totalRevenue: previousYear.totalRevenue,
              totalOrders: previousYear.totalOrders,
            },
            {
              year: currentYear.year,
              totalRevenue: currentYear.totalRevenue,
              totalOrders: currentYear.totalOrders,
            },
          ]);
        }
      }
    } catch (error) {
      console.error(error);
      setComparisonData([]);
    }
  };

  useEffect(() => {
    fetchSalesbyYear();
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
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={comparisonData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickFormatter={(value) => "Year " + value.toString()}
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
              barSize={80}
            />
            <Bar
              dataKey="totalOrders"
              fill={ordersColor}
              radius={5}
              barSize={80}
            />
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="min-h-[400px] w-full flex items-center justify-center">
          <p className="text-gray-400 mt-20 text-sm">No data available</p>
        </div>
      )}
    </>
  );
};

export default Yearly;
