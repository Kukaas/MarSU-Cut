import { useEffect, useState } from "react";
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
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast, Toaster } from "sonner";
import React from "react";
import { BASE_URL } from "@/lib/api";
import axios from "axios";
import { token } from "@/lib/token";
import ToasterError from "@/lib/Toaster";

const DashSalesReport = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [salesReports, setSalesReports] = useState([]);
  const [tab, setTab] = useState("monthly");
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    const fetchSalesReports = async () => {
      try {
        const response = await axios(`${BASE_URL}/api/v1/sales-report/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const data = await response.data;
        if (response.status === 200) {
          setSalesReports(data.salesReports);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error fetching sales reports.");
      }
    };

    fetchSalesReports();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=sales-report");
    } else if (currentUser) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

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

  const handlePrint = () => {
    let filteredData = [];
  
    // Determine the title based on the selected tab
    const title = tab === "monthly" 
      ? `Sales Report for ${monthNames[selectedMonth - 1]} ${selectedYear}` 
      : `Sales Report for Year ${selectedYear}`;
  
    if (tab === "monthly") {
      const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
      const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 1));
  
      filteredData = salesReports.filter((report) => {
        const salesDate = new Date(report.salesDate);
        return salesDate >= startDate && salesDate < endDate;
      });
    } else if (tab === "yearly") {
      // Calculate total revenue for each month
      const monthlyRevenue = Array(12).fill(0); // Array to hold revenue for each month
  
      // First, filter sales reports for the selected year
      const yearlyReports = salesReports.filter((report) => {
        const salesDate = new Date(report.salesDate);
        return salesDate.getFullYear() === selectedYear; // Check if the year matches
      });
  
      // If there are no sales reports for the selected year, show an error and return
      if (yearlyReports.length === 0) {
        toast.error("No sales data available for the selected year.");
        return;
      }
  
      yearlyReports.forEach((report) => {
        const salesDate = new Date(report.salesDate);
        const month = salesDate.getMonth(); // Get month (0-11)
        monthlyRevenue[month] += report.totalRevenue; // Sum revenue for each month
      });
  
      // Create filteredData with month names and total revenue
      filteredData = monthlyRevenue.map((revenue, index) => ({
        month: monthNames[index],
        totalRevenue: revenue,
      })).filter((report) => report.totalRevenue > 0); // Exclude months with no revenue
    }
  
    // If there is no data for monthly tab
    if (tab === "monthly" && filteredData.length === 0) {
      toast.error("No sales data available for the selected month.");
      return;
    }
  
    // Calculate overall total revenue for the footer
    const totalRevenue = filteredData.reduce(
      (sum, report) => sum + report.totalRevenue,
      0
    );
  
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      console.log("Print window opened successfully."); // Debugging log
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: Arial, sans-serif; }
              h1 { text-align: center; }
              table { border-collapse: collapse; width: 100%; margin-top: 20px; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              tfoot { font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <table>
              <thead>
                <tr>
                  <th>${tab === "monthly" ? "Sales Date" : "Month"}</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                ${filteredData
                  .map(
                    (report) => `
                    <tr>
                      <td>${tab === "monthly" 
                        ? new Date(report.salesDate).toLocaleDateString(
                            "en-US", 
                            { year: "numeric", month: "long", day: "numeric" }
                          ) 
                        : report.month}</td>
                      <td>${Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(report.totalRevenue)}</td>
                    </tr>
                  `
                  )
                  .join("")}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total Revenue for ${
                    tab === "monthly" ? monthNames[selectedMonth - 1] : "the year"
                  } ${selectedYear}</td>
                  <td>${Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(totalRevenue)}</td>
                </tr>
              </tfoot>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
  
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } else {
      toast.error("Failed to open print window.");
    }
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
              <AlertDialogHeader>
                <AlertDialogTitle>Print Sales Report</AlertDialogTitle>
                <AlertDialogDescription>
                  Select the time period you want to print.
                </AlertDialogDescription>
              </AlertDialogHeader>
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
                        setSelectedMonth(Number(month));
                        setSelectedYear(Number(year));
                      }}
                      defaultValue={`${selectedMonth}-${selectedYear}`}
                    >
                      <SelectTrigger className="w-full mb-5">
                        <span>{`${
                          monthNames[selectedMonth - 1]
                        } ${selectedYear}`}</span>
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
                        setSelectedYear(Number(value));
                      }}
                      defaultValue={currentYear.toString()}
                    >
                      <SelectTrigger className="w-full mb-5">
                        <span>{selectedYear}</span>
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-72 p-3">
                          <SelectGroup>
                            {years.map((year) => (
                              <React.Fragment key={year}>
                                <SelectItem value={year.toString()}>
                                  {year}
                                </SelectItem>
                                <Separator className="my-2" />
                              </React.Fragment>
                            ))}
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
                <Button onClick={handlePrint}>Print</Button>
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
      <Toaster position="top-center" closeButton={true} richColors={true} />
        
    </div>
  );
};

export default DashSalesReport;
