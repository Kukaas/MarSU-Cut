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

const Overview = () => {
  const [overview, setOverview] = useState([]);
  const [salesOverview, setSalesOverview] = useState([]);

  useEffect(() => {
    const fetchOverviews = async () => {
      try {
        const [productionRes, salesRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/v1/production/overview`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }),
          axios.get(`${BASE_URL}/api/v1/sales-report/overview`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }),
        ]);

        const productionData = productionRes.data.data;
        const salesData = salesRes.data.data;

        if (productionRes.status === 200 && salesRes.status === 200) {
          setOverview(productionData);
          setSalesOverview(salesData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchOverviews();
  }, []);

  const chartData = overview.map((productionItem) => {
    const salesItem = salesOverview.find(
      (sale) => sale.productType === productionItem.productType
    );

    return {
      productType: productionItem.productType,
      totalQuantity: productionItem.totalQuantity,
      currentMonthSales: salesItem ? salesItem.currentMonthSales : 0,
    };
  });

  const chartConfig = {
    totalQuantity: {
      label: "Production Quantity",
    },
    currentMonthSales: {
      label: "Current Month Sales",
    },
  };

  // Define colors for the areas
  const totalQuantityColor = "#8884d8"; // Blue for production quantity
  const currentMonthSalesColor = "#ff9c33"; // Orange for current month sales

  return (
    <>
      {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="productType"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              type="monotone"
              dataKey="totalQuantity"
              stroke={totalQuantityColor}
              fillOpacity={1}
              fill={totalQuantityColor}
              radius={5}
              barSize={30}
            />
            <Bar
              type="monotone"
              dataKey="currentMonthSales"
              stroke={currentMonthSalesColor}
              fillOpacity={1}
              fill={currentMonthSalesColor}
              radius={5}
              barSize={30}
            />
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-gray-500 mt-20">No data available</p>
        </div>
      )}
    </>
  );
};

export default Overview;
