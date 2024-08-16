import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PhilippinePeso, Shirt, ShoppingBasket } from "lucide-react";

import axios from "axios";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

import CardLoading from "./loading-components/CardLoading";
import Overview from "./Overview";
import RecentSales from "./RecentSales";
import { token } from "@/lib/token";

const Cards = () => {
  const [loading, setLoading] = useState(true);
  const [ordersThisMonth, setOrdersThisMonth] = useState([]);
  const [ordersLastMonth, setOrdersLastMonth] = useState([]);
  const [totalOrdersThisYear, setTotalOrdersThisYear] = useState([]);
  const [totalRentalsThisYear, setTotalRentalsThisYear] = useState([]);
  const [totalRentalsLastYear, setTotalRentalsLastYear] = useState([]);
  const [totalProductionsThisYear, setTotalProductionsThisYear] = useState(0);
  const [totalProductionsThisMonth, setTotalProductionsThisMonth] = useState(0);
  const [totalProductionsLastMonth, setTotalProductionsLastMonth] = useState(0);
  const [salesPerformance, setSalesPerformance] = useState({
    totalRevenue: 0,
    revenueDifference: 0,
    performanceStatus: "",
    percentageDifference: null,
  });
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchOrdersThisMonth = async () => {
      try {
        const res = await axios.get(
          "https://marsu.cut.server.kukaas.tech/api/v1/order/this-month",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
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
    fetchOrdersThisMonth();
  }, []);

  useEffect(() => {
    const fetchOrdersLastMonth = async () => {
      try {
        const res = await axios.get(
          "https://marsu.cut.server.kukaas.tech/api/v1/order/last-month",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
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

    fetchOrdersLastMonth();
  }, []);

  useEffect(() => {
    const fetchTotalOrdersThisYear = async () => {
      try {
        const res = await axios.get(
          "https://marsu.cut.server.kukaas.tech/api/v1/order/this-year",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
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

    fetchTotalOrdersThisYear();
  }, []);

  useEffect(() => {
    const fetchTotalRentalsThisYear = async () => {
      try {
        const res = await axios.get(
          "https://marsu.cut.server.kukaas.tech/api/v1/rental/total/this-year",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
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

    fetchTotalRentalsThisYear();
  }, []);

  useEffect(() => {
    const fetchRentalsLastYear = async () => {
      try {
        const res = await axios.get(
          "https://marsu.cut.server.kukaas.tech/api/v1/rental/total/last-year",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
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

    fetchRentalsLastYear();
  }, []);

  useEffect(() => {
    const fetchTotalProductionsThisYear = async () => {
      try {
        const res = await axios.get(
          "https://marsu.cut.server.kukaas.tech/api/v1/production/this-year",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const data = res.data.totalQuantity;
        if (res.status === 200) {
          setTotalProductionsThisYear(data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchTotalProductionsThisYear();
  }, []);

  useEffect(() => {
    const fetchTotalProductionsThisMonth = async () => {
      try {
        const res = await axios.get(
          "https://marsu.cut.server.kukaas.tech/api/v1/production/this-month",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const data = res.data.totalQuantity;
        if (res.status === 200) {
          setTotalProductionsThisMonth(data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchTotalProductionsThisMonth();
  }, []);

  useEffect(() => {
    const fetchTotalProductionsLastMonth = async () => {
      try {
        const res = await axios.get(
          "https://marsu.cut.server.kukaas.tech/api/v1/production/last-month",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const data = res.data.totalQuantity;
        if (res.status === 200) {
          setTotalProductionsLastMonth(data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchTotalProductionsLastMonth();
  }, []);

  useEffect(() => {
    const fetchTotalRevenueThisYear = async () => {
      try {
        const res = await axios.get(
          "https://marsu.cut.server.kukaas.tech/api/v1/sales-report/this-year",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const data = res.data.totalRevenue;
        if (res.status === 200) {
          setTotalRevenue(data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchTotalRevenueThisYear();
  }, []);

  useEffect(() => {
    const fetchSalesPerformance = async () => {
      try {
        const res = await axios.get(
          "https://marsu.cut.server.kukaas.tech/api/v1/sales-report/sales-performance",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (res.status === 200 && res.data.success) {
          const {
            performance,
            previousYearPerformance,
            revenueDifference,
            performanceStatus,
          } = res.data;
          const { totalRevenue } = performance;
          const { totalRevenue: previousTotalRevenue } =
            previousYearPerformance;

          let percentageDifference = null;
          if (previousTotalRevenue > 0) {
            percentageDifference =
              ((totalRevenue - previousTotalRevenue) / previousTotalRevenue) *
              100;
          }

          setSalesPerformance({
            totalRevenue,
            revenueDifference,
            performanceStatus,
            percentageDifference,
          });
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    fetchSalesPerformance();
  }, []);

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

  const calculatePercentageChangeProduction = (current, previous) => {
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

  const percentageChangeQuantity = calculatePercentageChangeProduction(
    totalProductionsThisMonth,
    totalProductionsLastMonth
  );

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
                  Orders |{" "}
                  <span className="text-muted-foreground">This Month</span>
                </CardTitle>
                <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <CountUp end={totalOrdersThisYear.length} duration={3} />
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
                  Rentals |{" "}
                  <span className="text-muted-foreground">This Year</span>
                </CardTitle>
                <Shirt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <CountUp end={totalRentalsThisYear.length} duration={3} />
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
                  Product Produced |{" "}
                  <span className="text-muted-foreground">This Year</span>
                </CardTitle>
                <Shirt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <CountUp end={totalProductionsThisYear} duration={3} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {percentageChangeQuantity !== "N/A"
                    ? `${percentageChangeQuantity}% from last month`
                    : "No data from last month"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue |{" "}
                  <span className="text-muted-foreground">This Year</span>
                </CardTitle>
                <PhilippinePeso className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <CountUp end={totalRevenue} duration={2} prefix="₱" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {salesPerformance.percentageDifference !== null ? (
                    <>
                      {salesPerformance.performanceStatus === "up" ? "+" : "-"}
                      {`${salesPerformance.percentageDifference.toFixed(
                        2
                      )}% from last year`}
                    </>
                  ) : (
                    "No data from last year"
                  )}
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
