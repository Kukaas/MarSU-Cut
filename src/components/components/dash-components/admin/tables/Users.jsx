// UI
import { Input } from "@/components/ui/input";
import { Spin, Tooltip, Typography } from "antd";

import { CheckCheckIcon, XIcon } from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import axios from "axios";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/custom-components/CustomTable";
import { toast } from "sonner";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import DeleteDialog from "@/components/components/custom-components/DeleteDialog";

const Users = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await axios.get(`${BASE_URL}/api/v1/user/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      const sortedData = result.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setData(sortedData);
      setOriginalData(sortedData);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      setData(originalData);
    } else {
      const filteredData = originalData.filter((user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setData(filteredData);
    }
  }, [searchValue, originalData]);

  const handleDelete = async (user) => {
    try {
      setDeleteLoading(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/user/delete/${user._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setDeleteLoading(false);
        toast.success("User deleted successfully");
        setData(data.filter((deletedUser) => deletedUser._id !== user._id));
      }
    } catch (error) {
      console.error(error);
      setDeleteLoading(false);
    }
  };

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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center justify-center space-x-2">
            <Tooltip title="Delete product">
              <DeleteDialog
                item={`user with name ${user?.name}`}
                handleDelete={() => handleDelete(user)}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Spin
      spinning={deleteLoading}
      indicator={
        <LoadingOutlined
          className="dark:text-white"
          style={{
            fontSize: 48,
          }}
        />
      }
    >
      <div className="w-full p-5 h-screen">
        <Typography.Title level={2} className="text-black dark:text-white">
          Users
        </Typography.Title>
        <div className="flex flex-wrap items-center justify-between pb-2">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Input
              placeholder="Filter by name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
        </div>
        <div className="rounded-md border">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : (
            <CustomTable columns={columns} data={data} />
          )}
        </div>
      </div>
    </Spin>
  );
};

export default Users;
