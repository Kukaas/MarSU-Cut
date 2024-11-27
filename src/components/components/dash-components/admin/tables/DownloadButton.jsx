import { forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import logo from "../../../../../assets/logo_msc.jpg";
import ToasterError from "@/lib/Toaster";

const DownloadButton = forwardRef(({ selectedDate, filteredData }, ref) => {
  useImperativeHandle(ref, () => ({
    handlePrint: (dateRange, data) => {
      handlePrint(dateRange, data);
    },
  }));

  const handlePrint = (dateRange, data) => {
    if (!dateRange?.from || !dateRange?.to || !data || data.length === 0) {
      ToasterError();
      return;
    }

    const formattedStartDate = dateRange.from.toLocaleString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const formattedEndDate = dateRange.to.toLocaleString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const title = `ACCOMPLISHMENT REPORT FOR ${formattedStartDate.toUpperCase()} TO ${formattedEndDate.toUpperCase()}`;

    // Sort by date (ascending order)
    const sortedData = [...data].sort((a, b) =>
      a.assignedEmployee.localeCompare(b.assignedEmployee)
    );

    const tableData = sortedData.map((item) => {
      const remarks =
        item.remarks?.charAt(0).toUpperCase() +
        item.remarks?.slice(1).toLowerCase();
      return [
        item.assignedEmployee,
        item.accomplishmentType,
        item.product,
        item.quantity,
        remarks,
      ];
    });

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
                        <th>Assigned Employee</th>
                            <th>Accomplishment Type</th>
                            <th>Product</th>
                            <th>Quantity</th>
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
                          <td>${row[4]}</td>
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
});

DownloadButton.displayName = "DownloadButton";

DownloadButton.propTypes = {
  selectedDate: PropTypes.shape({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
  }),
  filteredData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      assignedEmployee: PropTypes.string,
      accomplishmentType: PropTypes.string,
      product: PropTypes.string,
      quantity: PropTypes.number,
      remarks: PropTypes.string,
    })
  ),
};

export default DownloadButton;
