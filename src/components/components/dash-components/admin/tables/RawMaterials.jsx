// UI
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Spin, Tooltip, Typography } from "antd";

import { Loader2, PlusCircle } from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";

// others
import { useEffect, useState } from "react";
import axios from "axios";
import ToasterError from "@/lib/Toaster";

import EditRawMaterial from "@/components/components/forms/EditRawMaterial";
import AddNewRawMaterial from "@/components/components/forms/AddNewRawMaterial";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/CustomTable";

const RawMaterials = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);

  useEffect(() => {
    const fetchRawMaterial = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/v1/raw-materials/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const data = res.data;
        setData(data.rawMaterials);
        setOriginalData(data.rawMaterials);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchRawMaterial();
  }, []);

  useEffect(() => {
    if (searchValue.trim() === "") {
      setData(originalData);
    } else {
      const lowercasedSearchValue = searchValue.toLowerCase();

      const filteredData = originalData.filter((rawMaterial) =>
        rawMaterial.type.toLowerCase().includes(lowercasedSearchValue)
      );

      setData(filteredData);
    }
  }, [searchValue, originalData]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/raw-materials/delete/${selectedRawMaterial._id}`,
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
        setData((prevData) =>
          prevData.filter((product) => product._id !== selectedRawMaterial._id)
        );
        toast.success("Product deleted successfully!");
      } else {
        ToasterError();
      }
    } catch (error) {
      ToasterError({
        description: "Please check you internet connection and try again.",
      });
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "unit",
      header: "Unit",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusStyles = {
          "Out of Stock": {
            color: "red",
            badgeText: "Out of Stock",
          },
          "In Stock": {
            color: "green",
            badgeText: "In Stock",
          },
          default: {
            color: "gray",
            badgeText: "Unknown",
          },
        };

        const status = row.getValue("status");
        const { color, badgeText } =
          statusStyles[status] || statusStyles.default;

        return (
          <div className="status-badge">
            <div
              className="size-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <p className="text-[12px] font-semibold" style={{ color }}>
              {badgeText}
            </p>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rawMaterial = row.original;
        return (
          <div className="flex space-x-2">
            <Tooltip title="Edit product">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setSelectedRawMaterial(rawMaterial)}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Raw Material</DialogTitle>
                    <DialogDescription>
                      Please fill out the form below to edit raw material.
                    </DialogDescription>
                  </DialogHeader>
                  <EditRawMaterial selectedRawMaterial={selectedRawMaterial} />
                </DialogContent>
              </Dialog>
            </Tooltip>
            <Tooltip title="Delete product">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedRawMaterial(rawMaterial);
                    }}
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Raw Material</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this raw material?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center justify-end gap-2">
                    <DialogClose>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={(event) => handleDelete(event)}
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
      <div className="overflow-x-auto">
        <div className="w-full p-5 h-screen">
          <Typography.Title level={2} className="text-black dark:text-white">
            Raw Materials
          </Typography.Title>
          <div className="flex items-center py-4 justify-between">
            <div className="flex items-center w-[300px]">
              <Input
                placeholder="Search by type..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <Tooltip title="Add new raw material">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className="m-2">
                    <PlusCircle size={20} className="mr-2" />
                    New Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add a new raw material</DialogTitle>
                    <DialogDescription>
                      Click submit when you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <AddNewRawMaterial />
                </DialogContent>
              </Dialog>
            </Tooltip>
          </div>
          <div className="rounded-md border">
            {loading ? (
              <div className="p-4">Loading...</div>
            ) : (
              <CustomTable columns={columns} data={data} />
            )}
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Raw Material</DialogTitle>
              <DialogDescription>
                Please fill out the form below to add new raw material.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </Spin>
  );
};

export default RawMaterials;
