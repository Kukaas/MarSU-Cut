import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const PrintableForm = () => {
  const [sewerName, setSewerName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePrint = () => {
    if (!sewerName) {
      toast.error("Please add the name of the sewer");
      return;
    }
  
    const printContent = document
      .getElementById("printableContent")
      .innerHTML.replace("{sewerName}", sewerName);
  
    // Create a temporary print area
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = `
      <html>
          <head>
              <style>
                  @page {
                      size: landscape;
                      margin: 10mm;
                  }
                  body {
                      font-family: Arial, sans-serif;
                      width: 100%;
                      height: 100%;
                      margin: 0;
                      padding: 0;
                      background-color: #ffff;
                      color: #000;
                  }
                  table {
                      border-collapse: collapse;
                      width: 100%;
                      font-size: 10px;
                  }
                  th, td {
                      border: 1px solid black;
                      padding: 15px;
                      text-align: center;
                  }
  
                  @media print {
                      header, footer {
                          display: none;
                      }
                  }
              </style>
          </head>
          <body>
              ${printContent}
          </body>
      </html>
    `;
  
    // Trigger the print dialog
    window.print();
  
    // Restore original content after printing
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to reset the React state and DOM
  };

  // Get the current month and year
  const date = new Date();
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
  const currentMonth = monthNames[date.getMonth()]; // Get the current month name
  const currentYear = date.getFullYear(); // Get the current year

  return (
    <div className="container">
      <Button
        id="printButton"
        className="h-8"
        onClick={() => setIsDialogOpen(true)}
        variant="secondary"
      >
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>

      {/* Dialog for entering sewer name */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Enter Sewer Name</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="mt-3">
            <Input
              type="text"
              placeholder="Enter Sewer Name"
              value={sewerName}
              onChange={(e) => setSewerName(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end">
              <AlertDialogCancel asChild>
                <Button variant="secondary" className="mr-2">Cancel</Button>
              </AlertDialogCancel>
              <Button
                onClick={() => {
                  if (sewerName) {
                    handlePrint();
                    setIsDialogOpen(false);
                  } else {
                    toast.error("Please add the name of the sewer");
                  }
                }}
                type="submit"
              >
                Confirm
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hidden content for printing */}
      <div style={{ display: "none" }}>
        <div id="printableContent">
          <div className="header text-center mb-5">
            <h2 className="text-lg font-semibold">Production Details Form</h2>
            <p className="text-sm">
              For the Month of: {currentMonth} {currentYear}
            </p>
            <p className="text-sm">Sewer Name: {sewerName || "N/A"}</p>{" "}
          </div>

          <table>
            <thead>
              <tr>
                <th colSpan="6">Production Details</th>
                <th colSpan="2">Raw Materials Used</th>
              </tr>
              <tr>
                <th>Level</th>
                <th>Product Type</th>
                <th>Size</th>
                <th>Production Date From</th>
                <th>Production Date To</th>
                <th>Quantity</th>
                <th>Raw Material Type</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {/* Render 20 blank rows */}
              <td>COLLEGE</td>
              <td>POLO</td>
              <td>S16</td>
              <td>JANUARY 4, 2024</td>
              <td>JANUARY 10, 2024</td>
              <td>6</td>
              <td>CVC WHITE, CVC WHAT, ANOTHER MATERIAL</td>
              <td>2, 4, 10</td>
              {Array.from({ length: 15 }).map((_, index) => (
                <tr key={index}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrintableForm;
