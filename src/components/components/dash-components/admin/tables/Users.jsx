// UI
import { Input } from "@/components/ui/input";
import { Typography } from "antd";

import { CheckCheckIcon, XIcon } from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/CustomTable";

const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [table, setTable] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const result = await axios.get(`${BASE_URL}/api/v1/user/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    const sortedData = result.data.sort((a, b) => a.name.localeCompare(b.name));
    setData(sortedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      id: "number",
      header: "No.",
      cell: ({ row }) => <div>{row.index + 1}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "photo",
      header: "Profile",
      cell: ({ row }) => (
        <a target="_blank" rel="noopener noreferrer">
          <img
            src={row.getValue("photo")}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
        </a>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "verified",
      header: "Verified",
      cell: ({ row }) => (
        <div>
          {row.original.verified ? (
            <CheckCheckIcon className="text-green-500" />
          ) : (
            <XIcon className="text-red-500" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "isAdmin",
      header: "Admin",
      cell: ({ row }) => (
        <div>
          {row.original.isAdmin ? (
            <CheckCheckIcon className="text-green-500" />
          ) : (
            <XIcon className="text-red-500" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full p-5 h-screen">
      <Typography.Title level={2} className="text-black dark:text-white">
        Users
      </Typography.Title>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter Name..."
          value={table?.getColumn("name")?.getFilterValue() || ""}
          onChange={(event) => {
            if (table) {
              table
                .getColumn("studentNumber")
                ?.setFilterValue(event.target.value);
            }
          }}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <CustomTable
            columns={columns}
            data={data}
            onTableInstance={setTable}
          />
        )}
      </div>
    </div>
  );
};

export default Users;
