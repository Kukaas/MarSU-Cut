// UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spin, Tooltip, Typography } from "antd";

// icons
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { LoadingOutlined } from "@ant-design/icons";
import { ArrowDownLeft } from "lucide-react";

// others
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ToasterError from "@/lib/Toaster";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/custom-components/CustomTable";
import { statusColors } from "@/lib/utils";
import CustomBadge from "@/components/components/custom-components/CustomBadge";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";

function ArchiveRentals() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/v1/rental/archive/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        // Fetch the penalties for each rental
        const rentalsWithPenalties = await Promise.all(
          res.data.rentals.map(async (rental) => {
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
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  useEffect(() => {
    if (searchValue) {
      const filteredData = originalData.filter((rental) =>
        rental.coordinatorName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setData(filteredData);
    } else {
      setData(originalData);
    }
  }, [searchValue, originalData]);

  // Archive the rental
  const handleUnarchive = async (rental) => {
    try {
      setLoadingUpdate(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/rental/archive/update/${rental._id}`,
        {
          isArchived: false,
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
          `Rental of ${rental.coordinatorName} is unarchived successfully!`
        );

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

  // Delete the rental
  // const handleDelete = async (rental) => {
  //   try {
  //     setLoadingUpdate(true);
  //     const res = await axios.delete(
  //       `${BASE_URL}/api/v1/rental/${rental._id}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         withCredentials: true,
  //       }
  //     );

  //     if (res.status === 200) {
  //       setLoadingUpdate(false);
  //       toast.success(
  //         `Rental of ${rental.coordinatorName} is deleted successfully!`
  //       );
  //       // Update the data in the state
  //       setData((prevData) => {
  //         return prevData.filter((item) => item._id !== rental._id);
  //       });
  //     } else {
  //       ToasterError();
  //       setLoadingUpdate(false);
  //     }
  //   } catch (error) {
  //     ToasterError({
  //       description: "Please check you internet connection and try again.",
  //     });
  //     setLoadingUpdate(false);
  //   }
  // };

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
      header: "Actions",
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
              <DropdownMenuItem onClick={() => handleUnarchive(rental)}>
                Unarchive
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => handleDelete(rental)}>
                <span className="text-red-500 hover:text-red-400">Delete</span>
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
          Archive Rentals
        </Typography.Title>
        <div className="flex flex-wrap items-center justify-between pb-2">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Input
              placeholder="Filter by coordinator name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
          <Tooltip title="Archive Rentals">
            <Button
              variant="default"
              className="m-2 h-8"
              onClick={() => navigate("/dashboard?tab=rentals-admin")}
            >
              <ArrowDownLeft size={20} className="mr-2 h-4 w-4" />
              Rentals
            </Button>
          </Tooltip>
        </div>
        <div className="rounded-md border">
          <CustomTable data={data} columns={columns} loading={loading} />
        </div>
      </div>
    </Spin>
  );
}

export default ArchiveRentals;
