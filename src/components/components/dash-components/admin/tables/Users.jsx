// UI
import { Input } from "@/components/ui/input";
import { Typography } from "antd";

import { CheckCheckIcon, Loader2, XIcon } from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/CustomTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Users = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
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

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/user/delete/${selectedUser._id}`,
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
        setSelectedUser(null);
        setData(data.filter((user) => user._id !== selectedUser._id));
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedUser(user);
                  }}
                >
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete User</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this user?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-end gap-2">
                  <DialogClose>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete()}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 animate-spin" />
                        <span>Deleting</span>
                      </div>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full p-5 h-screen">
      <Typography.Title level={2} className="text-black dark:text-white">
        Users
      </Typography.Title>
      <div className="flex items-center py-4 justify-between">
        <div className="flex items-center w-[300px]">
          <Input
            placeholder="Search by name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
  );
};

export default Users;
