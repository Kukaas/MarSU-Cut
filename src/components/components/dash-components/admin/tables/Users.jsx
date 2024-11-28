// UI
import { Input } from "@/components/ui/input";
import { Typography } from "antd";

import { CheckCheckIcon, EyeIcon, XIcon } from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/custom-components/CustomTable";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import CustomPageTitle from "@/components/components/custom-components/CustomPageTitle";

const Users = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
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

  // const handleDelete = async (user) => {
  //   try {
  //     setDeleteLoading(true);
  //     const res = await axios.delete(
  //       `${BASE_URL}/api/v1/user/delete/${user._id}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         withCredentials: true,
  //       }
  //     );

  //     if (res.status === 200) {
  //       setDeleteLoading(false);
  //       toast.success("User deleted successfully");
  //       setData(data.filter((deletedUser) => deletedUser._id !== user._id));
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setDeleteLoading(false);
  //   }
  // };

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
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
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
            <AlertDialog>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger>
                      <EyeIcon />
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <AlertDialogContent className="sm:max-w-lg sm:w-full p-6">
                <AlertDialogHeader className="space-y-1">
                  <AlertDialogTitle>
                    <p className="text-sm font-semibold mb-5">
                      Profile Details of {user.name}
                    </p>
                  </AlertDialogTitle>
                  {user.role === "Student" && (
                    <>
                      {" "}
                      <div className="flex items-center justify-center gap-5 mt-4">
                        <div className="flex flex-col items-center">
                          <div className="relative w-20 h-20 mt-3 cursor-default shadow-md overflow-hidden rounded-full">
                            <Avatar className="w-full rounded-full h-full border-7 border-[lightgray] object-cover">
                              <AvatarImage src={user.photo} />
                              <AvatarFallback>
                                {`${user.name.split(" ")[0][0]}${
                                  user.name.split(" ").slice(-1)[0][0]
                                }`.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="mt-2 flex flex-col justify-center items-center">
                            <h2 className="text-sm font-semibold">
                              {user.name}
                            </h2>
                            <Typography.Text className="text-xs text-gray-400">
                              {user.email}
                            </Typography.Text>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex w-full justify-between gap-2 mt-10">
                          <div className="w-full flex flex-col items-center">
                            <h2 className="text-sm font-semibold">
                              {user.studentNumber}
                            </h2>
                            <Typography.Text className="text-xs text-gray-400">
                              Student Number
                            </Typography.Text>
                          </div>
                          <div className="w-full flex flex-col items-center">
                            <h2 className="text-sm font-semibold">
                              {user.level}
                            </h2>
                            <p className="text-xs text-gray-400">Level</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex w-full justify-between gap-2 mt-2">
                          <div className="w-full flex flex-col items-center">
                            <h2 className="text-sm font-semibold">
                              {user.department}
                            </h2>
                            <Typography.Text className="text-xs text-gray-400">
                              Department
                            </Typography.Text>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {user.role === "Coordinator" && (
                    <>
                      <div className="flex items-center justify-center gap-5 mt-4">
                        <div className="flex flex-col items-center">
                          <div className="relative w-20 h-20 mt-3 cursor-default shadow-md overflow-hidden rounded-full">
                            <Avatar className="w-full rounded-full h-full border-7 border-[lightgray] object-cover">
                              <AvatarImage src={user.photo} />
                              <AvatarFallback>
                                {`${user.name.split(" ")[0][0]}${
                                  user.name.split(" ").slice(-1)[0][0]
                                }`.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="mt-2 flex flex-col justify-center items-center">
                            <h2 className="text-sm font-semibold">
                              {user.name}
                            </h2>
                            <Typography.Text className="text-xs text-gray-400">
                              {user.email}
                            </Typography.Text>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex w-full justify-between gap-2 mt-10">
                          <div className="w-full flex flex-col items-center">
                            <h2 className="text-sm font-semibold">
                              {user.department}
                            </h2>
                            <Typography.Text className="text-xs text-gray-400">
                              Department
                            </Typography.Text>
                          </div>
                        </div>
                        <Separator />
                        <div className="w-full flex justify-between items-center">
                          <div className="w-full flex flex-col items-center">
                            <h2 className="text-sm font-semibold">
                              {user.role}
                            </h2>
                            <Typography.Text className="text-xs text-gray-400">
                              Role
                            </Typography.Text>
                          </div>
                          <div className="w-full flex flex-col items-center">
                            <h2 className="text-sm font-semibold">
                              {user.gender}
                            </h2>
                            <Typography.Text className="text-xs text-gray-400">
                              Gender
                            </Typography.Text>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {user.role === "CommercialJob" && (
                    <>
                      <div className="flex items-center justify-center gap-5 mt-4">
                        <div className="flex flex-col items-center">
                          <div className="relative w-20 h-20 mt-3 cursor-default shadow-md overflow-hidden rounded-full">
                            <Avatar className="w-full rounded-full h-full border-7 border-[lightgray] object-cover">
                              <AvatarImage src={user.photo} />
                              <AvatarFallback>
                                {`${user.name.split(" ")[0][0]}${
                                  user.name.split(" ").slice(-1)[0][0]
                                }`.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="mt-2 flex flex-col justify-center items-center">
                            <h2 className="text-sm font-semibold">
                              {user.name}
                            </h2>
                            <Typography.Text className="text-xs text-gray-400">
                              {user.email}
                            </Typography.Text>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex w-full justify-between gap-2 mt-10">
                          <div className="w-full flex flex-col items-center">
                            <h2 className="text-sm font-semibold">
                              {user.address}
                            </h2>
                            <Typography.Text className="text-xs text-gray-400">
                              Address
                            </Typography.Text>
                          </div>
                        </div>
                        <Separator />
                        <div className="w-full flex justify-between items-center">
                          <div className="w-full flex flex-col items-center">
                            <h2 className="text-sm font-semibold">
                              {user.role}
                            </h2>
                            <Typography.Text className="text-xs text-gray-400">
                              Role
                            </Typography.Text>
                          </div>
                          <div className="w-full flex flex-col items-center">
                            <h2 className="text-sm font-semibold">
                              {user.gender}
                            </h2>
                            <Typography.Text className="text-xs text-gray-400">
                              Gender
                            </Typography.Text>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {user.isAdmin && (
                    <div className="flex flex-col gap-4 mt-4">
                      <div className="flex w-full justify-between gap-2">
                        <div className="w-full flex flex-col items-center">
                          <h2 className="text-sm font-semibold">Admin</h2>
                          <p className="text-xs text-gray-400">
                            This user is an admin
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Close
                    </Button>
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  return (
    // <Spin
    //   spinning={deleteLoading}
    //   indicator={
    //     <LoadingOutlined
    //       className="dark:text-white"
    //       style={{
    //         fontSize: 48,
    //       }}
    //     />
    //   }
    // >
    <div className="w-full p-5 h-screen">
      <CustomPageTitle title="Users" description="View all users" />
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
        <CustomTable columns={columns} data={data} loading={loading} />
      </div>
    </div>
    // </Spin>
  );
};

export default Users;
