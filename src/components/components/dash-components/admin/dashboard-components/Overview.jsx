import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const Overview = () => {
  const chartData = [
    { month: "Jan", desktop: 4000, mobile: 2400 },
    { month: "Feb", desktop: 3000, mobile: 1398 },
    { month: "Mar", desktop: 2000, mobile: 9800 },
    { month: "Apr", desktop: 2780, mobile: 3908 },
    { month: "May", desktop: 1890, mobile: 4800 },
    { month: "Jun", desktop: 2390, mobile: 3800 },
    { month: "Jul", desktop: 3490, mobile: 4300 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      {}
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="currentColor" radius={4} />
        <Bar dataKey="mobile" fill="CurrentColor" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export default Overview;
