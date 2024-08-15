import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import axios from "axios";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const Weekly = () => {
  const [comparisonData, setComparisonData] = useState([]);

  const fetchSalesbyWeek = async () => {
    try {
      const res = await axios.get(
        "https://marsu.cut.server.kukaas.tech/api/v1/sales-report/sales-by-week"
      );

      const weeklySales = res.data.weeklySales;

      if (res.status === 200) {
        const transformedData = Object.keys(weeklySales).map((week) => ({
          week,
          ...weeklySales[week],
        }));
        setComparisonData(transformedData);

        // Prepare comparison data
        const currentWeek = transformedData[transformedData.length - 1];
        const previousWeek = transformedData[transformedData.length - 2];

        if (currentWeek && previousWeek) {
          setComparisonData([
            {
              week: previousWeek.week,
              totalRevenue: previousWeek.totalRevenue,
            },
            {
              week: currentWeek.week,
              totalRevenue: currentWeek.totalRevenue,
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
    fetchSalesbyWeek();
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
              dataKey="week"
              tickLine={false}
              tickMargin={10}
              tickFormatter={(value) => "Week " + value.toString()}
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

export default Weekly;
