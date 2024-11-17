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
  AlertDialogFooter,
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
import logo from "../../../../assets/logo_msc.jpg";
import CustomPageTitle from "../../custom-components/CustomPageTitle";

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
    let totalRevenue = 0;

    const title =
      tab === "monthly"
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
      const monthlyRevenue = Array(12).fill(0);
      const yearlyReports = salesReports.filter((report) => {
        const salesDate = new Date(report.salesDate);
        return salesDate.getFullYear() === selectedYear;
      });

      console.log("Yearly Reports:", yearlyReports); // Debugging log

      if (yearlyReports.length === 0) {
        toast.error("No sales data available for the selected year.");
        return;
      }

      yearlyReports.forEach((report) => {
        const salesDate = new Date(report.salesDate);
        const month = salesDate.getMonth();
        monthlyRevenue[month] += report.totalRevenue;
      });

      filteredData = monthlyRevenue
        .map((revenue, index) =>
          revenue > 0
            ? {
                month: monthNames[index],
                totalRevenue: revenue,
                orderItems: aggregateOrderItems(
                  yearlyReports.filter(
                    (report) => new Date(report.salesDate).getMonth() === index
                  )
                ),
              }
            : null
        )
        .filter(Boolean);

      console.log("Filtered Data:", filteredData); // Debugging log
    }

    if (tab === "monthly" && filteredData.length === 0) {
      toast.error("No sales data available for the selected month.");
      return;
    }

    filteredData.forEach((report) => {
      totalRevenue += report.totalRevenue;
    });

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { 
              position: relative; 
              text-align: center; 
              margin-bottom: 20px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
            }
            .header img { 
              position: absolute; 
              left: 20px; 
              width: 60px; 
            }
            .header h1 { 
              font-size: 24px; 
              font-weight: bold; 
              color: #800000; 
              margin: 0; 
            }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              margin-top: 20px; 
            }
            th, td { 
              border: 1px solid black; 
              padding: 8px; 
              text-align: center; 
            }
            th { 
              background-color: #800020; 
              color: white; 
            }
            .order-items-table {
              margin: 10px 0;
              width: 90%;
            }
            .order-items-table th {
              background-color: #800020;
              color: white;
            }
            tfoot { font-weight: bold; }
            h1.title { 
              color: #800000; 
              text-align: center; 
              margin-top: 20px; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logo}" alt="MarSu Logo" />
            <div>
              <p>Republic of the Philippines</p>
              <h1>Marinduque State University</h1>
              <p>Panfilio M. Manguera Sr. Road, Tanza, Boac, Marinduque</p>
            </div>
          </div>
    
          <h1 class="title">${title}</h1>
          <table>
            <thead>
              <tr>
                <th>${tab === "monthly" ? "Date" : "Month"}</th>
                <th>Total Revenue</th>
                <th>Order Items</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData
                .map(
                  (report) => `
                  <tr>
                    <td>${
                      tab === "monthly"
                        ? new Date(report.salesDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : report.month
                    }</td>
                    <td>${Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(report.totalRevenue)}</td>
                    <td>
                      <table class="order-items-table">
                        <thead>
                          <tr>
                            <th>Product Type</th>
                            <th>Level</th>
                            <th>Size</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${report.orderItems
                            .map(
                              (item) => `
                              <tr>
                                <td>${item.productType}</td>
                                <td>${item.level || "-"}</td>
                                <td>${item.size || "-"}</td>
                                <td>${item.quantity}</td>
                                <td>${Intl.NumberFormat("en-PH", {
                                  style: "currency",
                                  currency: "PHP",
                                }).format(item.unitPrice)}</td>
                                <td>${Intl.NumberFormat("en-PH", {
                                  style: "currency",
                                  currency: "PHP",
                                }).format(item.totalPrice)}</td>
                              </tr>
                            `
                            )
                            .join("")}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2">
                  <strong>Total Revenue for ${
                    tab === "monthly"
                      ? monthNames[selectedMonth - 1]
                      : selectedYear
                  }:</strong>
                </td>
                <td>
                  <strong>${Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(totalRevenue)}</strong>
                </td>
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

  // Function to aggregate order items
  const aggregateOrderItems = (reports) => {
    const aggregatedItems = {};

    reports.forEach((report) => {
      report.orderItems.forEach((item) => {
        const key = `${item.productType}-${item.level}-${item.size}`;
        if (!aggregatedItems[key]) {
          aggregatedItems[key] = { ...item };
        } else {
          aggregatedItems[key].quantity += item.quantity;
          aggregatedItems[key].totalPrice += item.totalPrice;
        }
      });
    });

    return Object.values(aggregatedItems);
  };

  return (
    <div className="w-full p-5 h-screen">
      <div className="flex justify-between items-center mb-4">
        <CustomPageTitle
          title="Sales Report"
          description="View and download sales reports"
        />
      </div>
      <div className="mb-4 flex justify-end">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <div className="p-2">
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
          </div>
          <div className="flex flex-col items-center gap-4">
            <AlertDialogFooter className="w-full flex justify-end gap-2">
              <AlertDialogCancel asChild>
                <Button variant="secondary" className="w-full">
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button
                onClick={handlePrint}
                className="w-full flex items-center justify-center"
              >
                Print
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      </div>
      <Helmet>
        <title>MarSUKAT | Sales Report</title>
        <meta name="description" content="" />
      </Helmet>
      <SalesSummary />
      <Toaster position="top-center" closeButton={true} richColors={true} />
    </div>
  );
};

export default DashSalesReport;
