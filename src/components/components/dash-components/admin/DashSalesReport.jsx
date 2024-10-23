import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography } from "antd";
import SalesSummary from "./sales-components/SalesSummary";
import { Button } from "@/components/ui/button";
import { PrinterIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import React from "react";
import axios from "axios";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";

const DashSalesReport = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("monthly");
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=sales-report");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Month starts from 0, so +1 for 1-based month
  const [selectedYear, setSelectedYear] = useState(currentYear); // New state for selected year
  const [printData, setPrintData] = useState(null); // State for data to be printed

  console.log(printData);

  // Month names for display
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

  // Generate options for months from 2016 to current year
  const startYear = 2016;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const monthOptions = years.flatMap((year) =>
    monthNames.map((month, index) => ({
      value: `${index + 1}-${year}`, // Format: "MM-YYYY"
      label: `${month} ${year}`, // Display: "Month Year"
    }))
  );

  // Print monthly sales report
  const fetchSales = async (month, year) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/sales-report/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (res.status === 200) {
        const filteredSales = res.data.salesReports.filter((sale) => {
          const saleDate = new Date(sale.salesDate);
          return (
            saleDate.getFullYear() === year && saleDate.getMonth() + 1 === month
          );
        });
        setSalesData(filteredSales);
        setPrintData(filteredSales); // Set the data to be printed
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Print monthly sales report
  const handlePrintMonthlySales = (month, year) => {
    fetchSales(month, year);
  };

  // Print yearly sales report
  const handlePrintYearlySales = (year) => {
    // Add logic to handle yearly sales report printing
  };

  return (
    <div className="w-full p-5 h-screen">
      <div className="flex justify-between items-center mb-4">
        <Typography.Title level={2} className="text-black dark:text-white">
          Sales Report
        </Typography.Title>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary">
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <div className="p-4">
              <Typography.Title
                level={4}
                className="text-black dark:text-white"
              >
                Print Sales Report
              </Typography.Title>
              <Typography.Paragraph className="text-black dark:text-white">
                Select a date range to print the sales report.
              </Typography.Paragraph>
              <Tabs defaultValue="monthly">
                <TabsList className="w-full">
                  <TabsTrigger
                    value="monthly"
                    className="w-full"
                    onClick={() => setTab("monthly")}
                  >
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger
                    value="yearly"
                    className="w-full"
                    onClick={() => setTab("yearly")}
                  >
                    Yearly
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="monthly">
                  <div className="flex gap-2 mt-3">
                    <Select
                      onValueChange={(value) => {
                        const [month, year] = value.split("-");
                        setSelectedMonth(Number(month)); // Set selected month
                        setSelectedYear(Number(year)); // Set selected year from value
                      }}
                      defaultValue={`${selectedMonth}-${selectedYear}`} // Default value set to current month and year
                    >
                      <SelectTrigger className="w-full mb-5">
                        <span>{`${
                          monthNames[selectedMonth - 1]
                        } ${selectedYear}`}</span>
                        {/* Dynamically display selected month and year */}
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-72 p-3">
                          <SelectGroup>
                            {monthOptions.map(({ value, label }) => (
                              <React.Fragment key={value}>
                                <SelectItem value={value}>{label}</SelectItem>
                                <Separator className="my-2" />
                              </React.Fragment>
                            ))}
                          </SelectGroup>
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="yearly">
                  <div className="flex gap-2 mt-3">
                    <Select
                      onValueChange={(value) => {
                        setSelectedYear(Number(value)); // Update the selected year
                      }}
                      defaultValue={currentYear.toString()}
                    >
                      <SelectTrigger className="w-full mb-5">
                        <span>{selectedYear}</span>{" "}
                        {/* Display the currently selected year */}
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-72 p-3">
                          <SelectGroup>
                            {/* Display years from 2016 to current year, with the current year last */}
                            {years.slice(0, -1).map(
                              (
                                year // Years from 2016 to the previous year
                              ) => (
                                <React.Fragment key={year}>
                                  <SelectItem value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                  <Separator className="my-2" />
                                </React.Fragment>
                              )
                            )}
                            <SelectItem value={currentYear.toString()}>
                              {currentYear}
                            </SelectItem>
                            <Separator className="my-2" />
                          </SelectGroup>
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-2">
                <AlertDialogCancel asChild>
                  <Button variant="secondary">Cancel</Button>
                </AlertDialogCancel>
                <Button
                  onClick={() => {
                    if (tab === "monthly") {
                      // Print monthly sales report
                      handlePrintMonthlySales(selectedMonth, selectedYear);
                    }
                    if (tab === "yearly") {
                      // Print yearly sales report
                      handlePrintYearlySales(selectedYear);
                    }
                  }}
                >
                  Print
                </Button>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Helmet>
        <title>MarSU Cut | Sales Report</title>
        <meta name="description" content="" />
      </Helmet>
      <SalesSummary />
    </div>
  );
};

export default DashSalesReport;
