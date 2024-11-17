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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ChartTooltipContentSales = ({ active, payload, mode }) => {
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
          Current Month Sales:
          <span>
            ₱{Intl.NumberFormat("en-PH").format(payload[0].value)}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const ChartTooltipContentProduction = ({ active, payload, mode }) => {
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
          Production Quantity:
          <span>
            {(payload[0].value)}
          </span>
        </p>
      </div>
    );
  }
  return null;
};


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

        if (productionRes.status === 200) {
          setOverview(productionRes.data.data);
        }

        if (salesRes.status === 200) {
          setSalesOverview(salesRes.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchOverviews();
  }, []);

  // Create production chart data, excluding "LOGO"
  const productionChartData = overview
    .filter((item) => item.productType !== "LOGO")
    .map((productionItem) => ({
      productType: productionItem.productType,
      totalQuantity: productionItem.totalQuantity,
    }));

  // Create sales chart data, including "LOGO"
  const salesChartData = salesOverview.map((salesItem) => ({
    productType: salesItem.productType,
    currentMonthSales: salesItem.currentMonthSales,
  }));

  const productionChartConfig = {
    totalQuantity: {
      label: "Production Quantity",
    },
  };

  const salesChartConfig = {
    currentMonthSales: {
      label: "Current Month Sales",
    },
  };

  // Define colors for the bars
  const productionColor = "#8884d8"; // Blue for production quantity
  const salesColor = "#ff9c33"; // Orange for current month sales

  return (
    <>
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-2 ml-2 mb-4">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
        </TabsList>
        <TabsContent value="production">
          {productionChartData.length > 0 ? (
            <ChartContainer
              config={productionChartConfig}
              className="min-h-[200px] w-full mb-4"
            >
              <BarChart data={productionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="productType"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContentProduction />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  type="monotone"
                  dataKey="totalQuantity"
                  stroke={productionColor}
                  fillOpacity={1}
                  fill={productionColor}
                  radius={5}
                  barSize={30}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center mb-4">
              <p className="text-gray-500 mt-20">
                No production data available
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="sales">
          {salesChartData.length > 0 ? (
            <ChartContainer
              config={salesChartConfig}
              className="min-h-[200px] w-full"
            >
              <BarChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="productType"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `₱ ${Intl.NumberFormat("en-PH").format(value)}`}
                />
                <ChartTooltip content={<ChartTooltipContentSales />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  type="monotone"
                  dataKey="currentMonthSales"
                  stroke={salesColor}
                  fillOpacity={1}
                  fill={salesColor}
                  radius={5}
                  barSize={30}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-gray-500 mt-20">No sales data available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Overview;
