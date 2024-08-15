import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import axios from "axios";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const Monthly = () => {
  const [comparisonData, setComparisonData] = useState([]);

  const fetchSalesbyMonth = async () => {
    try {
      const res = await axios.get(
        "https://marsu.cut.server.kukaas.tech/api/v1/sales-report/sales-by-month"
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
            },
            {
              month: currentMonth.month,
              totalRevenue: currentMonth.totalRevenue,
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
    fetchSalesbyMonth();
  }, []);

  const chartConfig = {
    totalRevenue: {
      label: "Total Revenue: ₱",
    },
  };

  const formatCurrency = (value) => `₱${value.toLocaleString()}`;

  return (
    <>
      {comparisonData.length > 0 ? (
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
              fill="currentColor"
              radius={5}
              barSize={30}
            />
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="min-h-[400px] w-full flex items-center justify-center">
          <p className="text-gray-400 mt-20 text-lg">No data available</p>
        </div>
      )}
    </>
  );
};

export default Monthly;
