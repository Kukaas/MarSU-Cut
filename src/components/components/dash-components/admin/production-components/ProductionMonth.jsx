import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { token } from "@/lib/token";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BASE_URL } from "@/lib/api";

const Legend = () => {
    // Define all product types (matching the colors)
    const allProductTypes = [
      "ACADEMIC GOWN", "PANTS", "POLO", "SKIRT", "BLOUSE", "PE TSHIRT", "JPANTS"
    ];
  
    // Define the product colors
    const productColors = {
      "ACADEMIC GOWN": "#8884d8",  // Light Purple
      "PANTS": "#82ca9d",           // Light Green
      "POLO": "#ff7300",            // Orange
      "SKIRT": "#ff6b6b",           // Red
      "BLOUSE": "#8884d8",          // Light Purple
      "PE TSHIRT": "#ffbf00",       // Yellow
      "JPANTS": "#00bfff",          // Light Blue
    };
  
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {allProductTypes.map((productType) => (
          <div key={productType} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: productColors[productType] }}
            ></div>
            <p className="text-xs">{productType}</p>
          </div>
        ))}
      </div>
    );
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

const ProductionMonth = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define an array of month names
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

  // Define all product types (including the new ones)
  const allProductTypes = [
    "ACADEMIC GOWN",
    "PANTS",
    "POLO",
    "SKIRT",
    "BLOUSE",
    "PE TSHIRT",
    "JPANTS",
  ];

  // Define a set of colors for each product type (you can add more colors as needed)
  const productColors = {
    "ACADEMIC GOWN": "#8884d8", // Light Purple
    PANTS: "#82ca9d", // Light Green
    POLO: "#ff7300", // Orange
    SKIRT: "#ff6b6b", // Red
    BLOUSE: "#8884d8", // Light Purple
    "PE TSHIRT": "#ffbf00", // Yellow
    JPANTS: "#00bfff", // Light Blue
  };

  // Fetch production data on component mount
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/v1/production/all/this-month`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.success) {
          // Transform the data to match the required format for recharts
          const transformedData = response.data.data.map((item) => {
            const monthIndex = parseInt(item.month.split("-")[1], 10) - 1; // Extract the month index
            const monthName = monthNames[monthIndex]; // Get the month name from the array
            const monthData = { name: monthName }; // Create the object for recharts

            // Add product quantities for each product type
            allProductTypes.forEach((productType) => {
              monthData[productType] = item[productType] || 0; // Default to 0 if product data is missing
            });

            return monthData;
          });

          // Fill in missing months with zero data for all product types
          const fullData = monthNames.map((month) => {
            const existingMonthData = transformedData.find(
              (item) => item.name === month
            );
            return (
              existingMonthData || {
                name: month,
                "ACADEMIC GOWN": 0,
                PANTS: 0,
                POLO: 0,
                SKIRT: 0,
                BLOUSE: 0,
                "PE TSHIRT": 0,
                JPANTS: 0,
              }
            ); // Default zero data for all product types
          });

          setData(fullData); // Set the transformed data to state
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false)); // Stop loading when data is fetched
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading text while fetching data

  return (
    <div style={{ width: "100%", height: 400 }} className="p-5">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data} // Pass fullData array here
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid vertical={false}/>
          <XAxis
            dataKey="name"
            tickFormatter={(month) => month} // Ensure month is rendered as the full month name
            tick={{ fontSize: 11 }} // Make font smaller
            tickMargin={10} // Increase margin between ticks
          />
          <YAxis tick={{ fontSize: 10 }} tickMargin={10} />
          <ChartTooltip content={<TooltipContent />} />
          <Legend />
          {allProductTypes.map((productType, index) => (
            <Line
              key={productType}
              type="monotone"
              dataKey={productType}
              stroke={productColors[productType] || "#8884d8"} // Set color based on product type
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductionMonth;
