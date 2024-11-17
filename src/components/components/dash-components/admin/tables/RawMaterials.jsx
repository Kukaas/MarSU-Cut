// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
import { Tooltip, Typography } from "antd";

import { PlusCircle } from "lucide-react";
// import { LoadingOutlined } from "@ant-design/icons";

// others
import { useEffect, useState } from "react";
import axios from "axios";
// import ToasterError from "@/lib/Toaster";

import EditRawMaterial from "@/components/components/forms/EditRawMaterial";
import AddNewRawMaterial from "@/components/components/forms/AddNewRawMaterial";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/custom-components/CustomTable";
import { statusColors } from "@/lib/utils";
import CustomBadge from "@/components/components/custom-components/CustomBadge";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
// import DeleteDialog from "@/components/components/custom-components/DeleteDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CustomPageTitle from "@/components/components/custom-components/CustomPageTitle";

const RawMaterials = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  // const [deleteLoading, setDeleteLoading] = useState(false);
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

  // const handleDelete = async (rawMaterial) => {
  //   try {
  //     setDeleteLoading(true);
  //     const res = await axios.delete(
  //       `${BASE_URL}/api/v1/raw-materials/delete/${rawMaterial._id}`,
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
  //       setData((prevData) =>
  //         prevData.filter((rawMaterial) => rawMaterial._id !== rawMaterial._id)
  //       );
  //       toast.success("Raw material deleted successfully!");
  //     } else {
  //       ToasterError();
  //     }
  //   } catch (error) {
  //     ToasterError({
  //       description: "Please check you internet connection and try again.",
  //     });
  //     setDeleteLoading(false);
  //   }
  // };

  const columns = [
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
    },
    {
      accessorKey: "unit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit" />
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rawMaterial = row.original;
        return (
          <div className="flex space-x-2">
            <Tooltip title="Edit product">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    onClick={() => setSelectedRawMaterial(rawMaterial)}
                  >
                    Edit
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Edit Raw Material</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please fill out the form below to edit raw material.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <EditRawMaterial selectedRawMaterial={selectedRawMaterial} />
                </AlertDialogContent>
              </AlertDialog>
            </Tooltip>
            {/* <Tooltip title="Delete raw material">
              <DeleteDialog
                item={`raw material with ID ${rawMaterial?._id}`}
                handleDelete={() => handleDelete(rawMaterial)}
              />
            </Tooltip> */}
          </div>
        );
      },
    },
  ];

  const handleRawMaterialAdded = (rawMaterial) => {
    console.log("Adding raw material:", rawMaterial);
    setData((prevData) => [...prevData, rawMaterial]);
  };

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
    <div className="overflow-x-auto">
      <div className="w-full p-5 h-screen">
      <CustomPageTitle title="Raw Materials" description="View and manage raw materials" />
        <div className="flex flex-wrap items-center justify-between pb-2">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Input
              placeholder="Filter by type..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-8 w-[270px]"
            />
          </div>
          <Tooltip title="Add new raw material">
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="default" className="m-2 h-8">
                  <PlusCircle size={20} className="mr-2 h-4 w-4" />
                  New Material
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Add a new raw material</AlertDialogTitle>
                  <AlertDialogDescription>
                    Click submit when you&apos;re done.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AddNewRawMaterial
                  onRawMaterialAdded={handleRawMaterialAdded}
                  setIsDialogOpen={setIsDialogOpen}
                />
              </AlertDialogContent>
            </AlertDialog>
          </Tooltip>
        </div>
        <div className="rounded-md border">
          <CustomTable columns={columns} data={data} loading={loading} />
        </div>
      </div>
    </div>
    // </Spin>
  );
};

export default RawMaterials;
