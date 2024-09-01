// UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Spin, Typography } from "antd";
import { toast } from "sonner";

// icons
import { LoadingOutlined } from "@ant-design/icons";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

// others
import { useNavigate } from "react-router-dom";
import ToasterError from "@/lib/Toaster";
import { useState, useEffect } from "react";
import axios from "axios";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/CustomTable";
import { statusColors } from "@/lib/utils";
import CustomBadge from "@/components/components/CustomBadge";
import DataTableColumnHeader from "@/components/components/DataTableColumnHeader";
import DataTableToolBar from "@/components/components/DataTableToolBar";

function Rentals() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/rental/all/get`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const activeRentals = res.data.rentals.filter(
          (rental) => !rental.isArchived
        );

        const rentalsWithPenalties = await Promise.all(
          activeRentals.map(async (rental) => {
            const penaltyRes = await axios.get(
              `${BASE_URL}/api/v1/rental/penalty/${rental._id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
              }
            );
            return { ...rental, penalty: penaltyRes.data.penalty };
          })
        );
        setData(rentalsWithPenalties);
        setOriginalData(rentalsWithPenalties);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  useEffect(() => {
    if (searchValue) {
      const filteredData = originalData.filter((order) =>
        order.coordinatorName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setData(filteredData);
    } else {
      setData(originalData);
    }
  }, [searchValue, originalData]);

  const handleReject = async (rental) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/rental/update/${rental._id}`,
        { status: "REJECTED" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setLoadingUpdate(false);
        toast.success(
          `Rental of ${rental.coordinatorName} is rejected successfully!`
        );

        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === rental._id) {
              return { ...item, status: "REJECTED" };
            }

            return item;
          });
        });
      } else {
        ToasterError();
        setLoadingUpdate(false);
      }
    } catch (error) {
      ToasterError();
      setLoadingUpdate(false);
    }
  };

  // Update the status of the rental to approved
  const handleApprove = async (rental) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/rental/update/${rental._id}`,
        { status: "APPROVED" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setLoadingUpdate(false);
        toast.success(
          `Rental of ${rental.coordinatorName} is approved successfully!`
        );

        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === rental._id) {
              return { ...item, status: "APPROVED" };
            }

            return item;
          });
        });
      } else {
        ToasterError();
        setLoadingUpdate(false);
      }
    } catch (error) {
      ToasterError();
      setLoadingUpdate(false);
    }
  };

  const handleGiven = async (rental) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/rental/update/${rental._id}`,
        {
          status: "GIVEN",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setLoadingUpdate(false);
        toast.success(`Rental of ${rental.coordinatorName} is given!`);

        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === rental._id) {
              return { ...item, status: "GIVEN" }; // Correct status update
            }
            return item;
          });
        });
      } else {
        ToasterError();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message); // Correct error handling
      } else {
        ToasterError({
          description: "Please check you internet connection and try again.",
        }); // Handle other errors
      }
      setLoadingUpdate(false);
    }
  };

  // Update the status of the rental to returned
  const handleReturn = async (rental) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/rental/update/${rental._id}`,
        {
          status: "RETURNED",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setLoadingUpdate(false);
        toast.success(`Rental of ${rental.coordinatorName} is returned!`);

        // Update the data in the state
        setData((prevData) => {
          return prevData.map((item) => {
            if (item._id === rental._id) {
              return { ...item, status: "RETURNED" };
            }

            return item;
          });
        });
      } else {
        ToasterError();
        setLoadingUpdate(false);
      }
    } catch (error) {
      ToasterError({
        description: "Please check you internet connection and try again.",
      });
      setLoadingUpdate(false);
    }
  };

  // Archive the rental
  const handleArchive = async (rental) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/rental/archive/update/${rental._id}`,
        {
          isArchived: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setLoadingUpdate(false);
        toast.success(
          `Rental of ${rental.coordinatorName} is archived successfully!`
        );

        setData((prevData) => {
          return prevData.filter((item) => item._id !== rental._id);
        });
      } else {
        ToasterError();
        setLoadingUpdate(false);
      }
    } catch (error) {
      {
        ToasterError({
          description: "Please check you internet connection and try again.",
        });
        setLoadingUpdate(false);
      }
    }
  };

  // Delete the rental
  const handleDelete = async (rental) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/rental/${rental._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setLoadingUpdate(false);
        toast.success(
          `Rental of ${rental.coordinatorName} is deleted successfully!`
        );
        // Update the data in the state
        setData((prevData) => {
          return prevData.filter((item) => item._id !== rental._id);
        });
      } else {
        ToasterError();
        setLoadingUpdate(false);
      }
    } catch (error) {
      ToasterError({
        description: "Please check you internet connection and try again.",
      });
      setLoadingUpdate(false);
    }
  };

  const columns = [
    {
      accessorKey: "idNumber",
      header: "ID Number",
    },
    {
      accessorKey: "coordinatorName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "department",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "rentalDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rental Date" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("rentalDate"));
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "returnDate",
      header: "ReturnDate",
      key: "returnDate",
      cell: ({ row }) => {
        const date = new Date(row.getValue("returnDate"));
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        const { color, badgeText } =
          statusColors[status] || statusColors.default;

        return <CustomBadge color={color} badgeText={badgeText} />;
      },
    },
    {
      accessorKey: "penalty",
      header: "Penalty",
      render: (penalty) => `₱${penalty}`,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const rental = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(rental._id)}
              >
                Copy Rental ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleReject(rental)}
                  disabled={["APPROVED", "GIVEN", "RETURNED"].includes(
                    rental.status
                  )}
                >
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleApprove(rental)}
                  disabled={["APPROVED", "GIVEN", "RETURNED"].includes(
                    rental.status
                  )}
                >
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGiven(rental)}>
                  Given
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReturn(rental)}>
                  Returned
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleArchive(rental)}>
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(rental)}>
                <span className="text-red-500 hover:text-red-400">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    if (status === "All") {
      setData(originalData); // Assuming originalData is the unfiltered data
    } else {
      setData(originalData.filter((order) => order.status === status));
    }
  };

  const status = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    GIVEN: "GIVEN",
    RETURNED: "RETURNED",
  };

  return (
    <Spin
      spinning={loadingUpdate}
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
          Rentals
        </Typography.Title>
        <DataTableToolBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleStatusChange={handleStatusChange}
          statusFilter={statusFilter}
          navigate={() => navigate("/dashboard?tab=archive-rentals")}
          status={status}
          placeholder="Filter by coordinator name..."
        />
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
}

export default Rentals;
