import { useEffect, useState } from "react";
import axios from "axios";

import TableLoading from "./loading-components/TableLoading";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import { statusColors } from "@/lib/utils";
import CustomBadge from "@/components/components/custom-components/CustomBadge";
import CustomTable from "@/components/components/custom-components/CustomTable";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";

const TopDepartments = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDepartment = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/order/top-departments`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const data = res.data.departments;
        if (res.status === 200) {
          // Sort the departments by total in ascending order
          const sortedData = data.sort((a, b) => b.total - a.total);
          const dataWithIndex = sortedData.map((item, index) => ({
            ...item,
            index: index + 1,
          }));


          setRecentOrders(dataWithIndex);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        return [];
      }
    };
    fetchTopDepartment();
  }, []);

  const columns = [
    {
      accessorKey: "index",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="#" />
      ),
      cell: ({ row }) => <span className="font-semibold">
        Top {row.index + 1}
      </span>,
    },
    {
      accessorKey: "_id",
      header: "Department",
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Orders" />
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="rounded-md border">
        {loading ? (
          <div className="space-y-3 p-2">
            <TableLoading />
            <TableLoading />
            <TableLoading />
            <TableLoading />
            <TableLoading />
          </div>
        ) : (
          <CustomTable columns={columns} data={recentOrders} />
        )}
      </div>
    </div>
  );
};

export default TopDepartments;
