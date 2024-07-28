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
import { PhilippinePeso, Shirt, ShoppingBasket } from "lucide-react";

const Cards = () => {
  const [loading, setLoading] = useState(true);
  const [ordersThisMonth, setOrdersThisMonth] = useState([]);
  const [ordersLastMonth, setOrdersLastMonth] = useState([]);
  const [totalOrdersThisYear, setTotalOrdersThisYear] = useState([]);
  const [totalRentalsThisYear, setTotalRentalsThisYear] = useState([]);
  const [totalRentalsLastYear, setTotalRentalsLastYear] = useState([]);

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
  };

  const fetchTotalRentalsThisYear = async () => {
    try {
      const res = await axios.get(
        "https://garments.kukaas.tech/api/v1/rental/total/this-year"
      );

      const data = res.data.rentals;
      if (res.status === 200) {
        setTotalRentalsThisYear(data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return [];
    }
  };

  const fetchRentalsLastYear = async () => {
    try {
      const res = await axios.get(
        "https://garments.kukaas.tech/api/v1/rental/total/last-year"
      );

      const data = res.data.rentals;
      if (res.status === 200) {
        setTotalRentalsLastYear(data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return [];
    }
  };

  const calculatePercentageChangeOrders = (current, previous) => {
    if (
      typeof current !== "number" ||
      typeof previous !== "number" ||
      isNaN(current) ||
      isNaN(previous)
    ) {
      return "N/A"; // Handle non-numeric inputs
    }
    if (previous === 0) return "N/A"; // Handle division by zero
    let change = ((current - previous) / previous) * 100;
    change = Math.max(-100, Math.min(100, change)); // Cap the change at -100% and +100%
    const sign = change >= 0 ? "+" : "-";
    return `${sign}${Math.abs(change).toFixed()}`; // Format to one decimal place and add sign
  };

  const percentageChangeOrders = calculatePercentageChangeOrders(
    ordersThisMonth.length,
    ordersLastMonth.length
  );

  const calculatePercentageChangeRentals = (current, previous) => {
    if (
      typeof current !== "number" ||
      typeof previous !== "number" ||
      isNaN(current) ||
      isNaN(previous)
    ) {
      return "N/A"; // Handle non-numeric inputs
    }
    if (previous === 0) return "N/A"; // Handle division by zero
    let change = ((current - previous) / previous) * 100;
    change = Math.max(-100, Math.min(100, change)); // Cap the change at -100% and +100%
    const sign = change >= 0 ? "+" : "-";
    return `${sign}${Math.abs(change).toFixed()}`; // Format to one decimal place and add sign
  };

  const percentageChangeRentals = calculatePercentageChangeRentals(
    totalRentalsThisYear.length,
    totalRentalsLastYear.length
  );

  useEffect(() => {
    fetchOrdersThisMonth();
    fetchOrdersLastMonth();
    fetchTotalOrdersThisYear();
    fetchRentalsLastYear();
    fetchTotalRentalsThisYear();
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
                <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalOrdersThisYear.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {percentageChangeOrders !== "N/A"
                    ? `${percentageChangeOrders}% from last month`
                    : "No data from last month"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Rentals This Year
                </CardTitle>
                <Shirt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalRentalsThisYear.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {percentageChangeRentals !== "N/A"
                    ? `${percentageChangeRentals}% from last year`
                    : "No data from last year"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Product Produced This Year
                </CardTitle>
                <Shirt className="h-4 w-4 text-muted-foreground" />
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
                  Total Revenue
                </CardTitle>
                <PhilippinePeso className="h-4 w-4 text-muted-foreground" />
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
