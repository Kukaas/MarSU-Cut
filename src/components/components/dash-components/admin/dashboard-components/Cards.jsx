import { useEffect, useState } from "react";
import Overview from "./Overview";
import RecentSales from "./RecentSales";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CardLoading from "./loading-components/CardLoading";
import axios from "axios";
import { ShoppingBasket } from "lucide-react";

const Cards = () => {
  const [loading, setLoading] = useState(true);
  const [ordersThisMonth, setOrdersThisMonth] = useState([]);
  const [ordersLastMonth, setOrdersLastMonth] = useState([]);
  const [totalOrdersThisYear, setTotalOrdersThisYear] = useState([])

  const fetchOrdersThisMonth = async () => {
    try {
      const res = await axios.get(
        "https://garments.kukaas.tech/api/v1/order/this-month"
      );

      const data = res.data.orders;
      if (res.status === 200) {
        setOrdersThisMonth(data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return [];
    }
  };

  const fetchOrdersLastMonth = async () => {
    try {
      const res = await axios.get(
        "https://garments.kukaas.tech/api/v1/order/last-month"
      );

      const data = res.data.orders;
      if (res.status === 200) {
        setOrdersLastMonth(data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return [];
    }
  };

  const fetchTotalOrdersThisYear = async () => {
    try {
      const res = await axios.get(
        "https://garments.kukaas.tech/api/v1/order/this-year"
      );

      const data = res.data.orders;
      if (res.status === 200) {
        setTotalOrdersThisYear(data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return [];
    }
  }

  const calculatePercentageChange = (current, previous) => {
    if (typeof current !== 'number' || typeof previous !== 'number' || isNaN(current) || isNaN(previous)) {
      return 'N/A'; // Handle non-numeric inputs
    }
    if (previous === 0) return 'N/A'; // Handle division by zero
    let change = ((current - previous) / previous) * 100;
    change = Math.max(-100, Math.min(100, change)); // Cap the change at -100% and +100%
    const sign = change >= 0 ? '+' : '-';
    return `${sign}${Math.abs(change).toFixed()}`; // Format to one decimal place and add sign
  };
  
  const percentageChange = calculatePercentageChange(
    ordersThisMonth.length,
    ordersLastMonth.length
  );

  useEffect(() => {
    fetchOrdersThisMonth();
    fetchOrdersLastMonth();
    fetchTotalOrdersThisYear()
  });

  return (
    <div className="flex-1 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <CardLoading />
            <CardLoading />
            <CardLoading />
            <CardLoading />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders This Year
                </CardTitle>
                <ShoppingBasket className="h-4 w-4 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrdersThisYear.length}</div>
                <p className="text-xs text-muted-foreground">
                  {percentageChange !== "N/A"
                    ? `${percentageChange}% from last month`
                    : "No data from last month"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              You made <span>{ordersThisMonth.length}</span> orders this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cards;
