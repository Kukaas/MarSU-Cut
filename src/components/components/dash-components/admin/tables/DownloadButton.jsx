import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Printer } from "lucide-react";
import logo from "../../../../../assets/logo_msc.jpg";

function DownloadButton({ selectedDate, filteredData }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileName, setFileName] = useState("accomplishment_report.pdf");

  const toastError = () => {
    toast.error("No data to print, please select a month", {
      action: {
        label: "Ok",
      },
    });
  };

  const handlePrint = () => {
    const startDate = selectedDate?.from;
    const endDate = selectedDate?.to;

    if (!startDate || !endDate) {
      toastError();
      return;
    }

    if (!filteredData || filteredData.length === 0) {
      toastError();
      return;
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const getMonthsInRange = (start, end) => {
      const months = [];
      let current = new Date(start);
      while (current <= end) {
        months.push(current.toLocaleString("default", { month: "long" }));
        current.setMonth(current.getMonth() + 1);
      }
      return months;
    };

    const monthNames = getMonthsInRange(startDate, endDate);
    const formattedMonths = monthNames.join(", ");
    const title = `ACCOMPLISHMENT REPORT FOR THE MONTH(S) OF ${formattedMonths.toUpperCase()} ${endDate.getFullYear()}`;

    // Sort by date (ascending order)
    const sortedData = filteredData.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const tableData = sortedData.map((item) => {
      const splitAccomplishment = item.accomplishment.split("\n");
      const remarks =
        item.remarks?.charAt(0).toUpperCase() +
        item.remarks?.slice(1).toLowerCase();
      return [
        formatDate(item.date),
        item.type,
        splitAccomplishment.join("<br/>"),
        remarks,
      ];
    });

    // Open a new window for printing
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    @page {
                        size: portrait;
                        margin: 10mm;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                    }
                    .header {
                      position: relative; /* Set relative positioning for the header */
                      text-align: center;
                      margin-bottom: 20px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    }
                    .header img {
                      position: absolute; /* Set absolute positioning for the logo */
                      left: 20px; /* Adjust as needed to position the logo */
                      width: 60px;
                    }
                    .header h1 {
                      font-size: 24px;
                      font-weight: bold;
                      color: #800000;
                      margin: 0;
                    }
                    .header p {
                      font-size: 14px;
                      color: #555;
                      margin: 5px 0 0 0;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        font-size: 12px;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                         background-color: #800000;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${logo}" alt="Company Logo" />
                    <div>
                        <p>Republic of the Philippines</p>
                        <h1>Marinduque State University</h1>
                        <p>Panfilio M. Manguera Sr. Road, Tanza, Boac, Marinduque</p>
                    </div>
                </div>
                <h1 style="text-align: center; font-size: 18px; color: #800000;">${title}</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Accomplishment</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                      ${tableData
                        .map(
                          (row) => `
                        <tr>
                          <td>${row[0]}</td>
                          <td>${row[1]}</td>
                          <td>${row[2]}</td>
                          <td>${row[3]}</td>
                        </tr>
                      `
                        )
                        .join("")}
                    </tbody>
                </table>
                <footer style="position: absolute; bottom: 20px; left: 20px; width: calc(100% - 40px); display: flex; justify-content: space-between;">
                    <div>
                        <p>Prepared By:</p>
                        <p>MECHAELA F. BABIERA</p>
                        <p>Support Staff</p>
                    </div>
                    <div style="text-align: right;">
                        <p>RHODA N. MOLBOG</p>
                        <p>Head BAO</p>
                    </div>
                </footer>
  
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
      alert("Please allow popups for this website");
    }
  };

  return (
    <div>
      <Button
        className="h-8"
        onClick={() => setIsDialogOpen(true)}
        variant="outline"
      >
        <Printer className="mr-2 h-4" />
        Print
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Print Report</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="mt-3">
            <Input
              type="text"
              placeholder="Enter file name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end">
              <AlertDialogCancel asChild>
                <Button variant="secondary" className="mr-2">
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button
                onClick={() => {
                  handlePrint();
                  setIsDialogOpen(false);
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

DownloadButton.propTypes = {
  selectedDate: PropTypes.shape({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
  }),
  filteredData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      type: PropTypes.string,
      accomplishment: PropTypes.string,
      remarks: PropTypes.string,
    })
  ),
};

export default DownloadButton;
