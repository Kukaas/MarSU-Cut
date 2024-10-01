import { useEffect, useState } from "react";
import axios from "axios";

import TableLoading from "./loading-components/TableLoading";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import { statusColors } from "@/lib/utils";
import CustomBadge from "@/components/components/custom-components/CustomBadge";
import CustomTable from "@/components/components/custom-components/CustomTable";

const RecentSales = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRencentOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/order/recent`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const data = res.data.orders;
        if (res.status === 200) {
          setRecentOrders(data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        return [];
      }
    };
    fetchRencentOrders();
  }, []);

  const columns = [
    {
      accessorKey: "studentName",
      header: "Name",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const { color, badgeText } =
          statusColors[status] || statusColors.default;

        return <CustomBadge color={color} badgeText={badgeText} />;
      },
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

export default RecentSales;
