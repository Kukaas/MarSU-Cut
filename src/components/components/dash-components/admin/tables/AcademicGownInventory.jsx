// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
import { Tooltip } from "antd";

import { PlusCircle } from "lucide-react";
// import { LoadingOutlined } from "@ant-design/icons";

// others
import { useEffect, useState } from "react";
import axios from "axios";
// import ToasterError from "@/lib/Toaster";

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
import { useSelector } from "react-redux";
import AddNewAcademic from "@/components/components/forms/AddNewAcademic";
import EditAcademicGown from "@/components/components/forms/EditAcademicGown";

const AcademicGownInventory = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchFinishedProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/v1/academic-gown/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const data = res.data;
        setData(data.academicGown);
        setOriginalData(data.academicGown);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchFinishedProduct();
  }, []);

  useEffect(() => {
    if (searchValue.trim()) {
      const lowercasedSearchValue = searchValue.toLowerCase();

      // Filter based on productType, size, or level
      const filteredData = originalData.filter(
        (product) =>
          product.productType.toLowerCase().includes(lowercasedSearchValue) ||
          product.size.toLowerCase().includes(lowercasedSearchValue) ||
          product.level.toLowerCase().includes(lowercasedSearchValue)
      );

      setData(filteredData);
    } else {
      setData(originalData);
    }
  }, [searchValue, originalData]);

  const handleProductUpdated = () => {
    setIsDialogOpen(false);
  };

  const columns = [
    {
      accessorKey: "level",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Level" />
      ),
    },
    {
      accessorKey: "productType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product Type" />
      ),
    },
    {
      accessorKey: "department",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
    },
    {
      accessorKey: "size",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Size" />
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
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center justify-center space-x-2">
            <Tooltip title="Edit product">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(product);
                    }}
                  >
                    Edit
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-[500px] max-h-[600px] overflow-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Edit Product</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please fill out the form below to edit product.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <EditAcademicGown
                    selectedProduct={selectedProduct}
                    onAcademicUpdated={handleProductUpdated}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                </AlertDialogContent>
              </AlertDialog>
            </Tooltip>
            {/* <Tooltip title="Delete product">
              <DeleteDialog
                item={`raw material with ID ${product?._id}`}
                handleDelete={() => handleDelete(product)}
              />
            </Tooltip> */}
          </div>
        );
      },
    },
  ];

  const handleProductAdded = (newProduct) => {
    setData((prevData) => [...prevData, newProduct]);
  };

  return (
    <div className="overflow-x-auto">
      <div className="w-full p-5 h-screen">
        <CustomPageTitle
          title="Academic Gown Inventory"
          description="View and manage academic gown inventory"
        />
        <div className="flex flex-wrap items-center justify-between pb-2">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Input
              placeholder="Filter by product type, size, level..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-8 w-[280px]"
            />
          </div>
          <Tooltip title="Add new product">
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              {currentUser.role === "JO" && currentUser.isAdmin && (
                <AlertDialogTrigger asChild>
                  <Button variant="default" className="m-2 h-8">
                    <PlusCircle size={20} className="mr-2 h-4 w-4" />
                    New Product
                  </Button>
                </AlertDialogTrigger>
              )}
              <AlertDialogContent className="sm:max-w-[500px] max-h-[600px] overflow-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>Add a new product</AlertDialogTitle>
                  <AlertDialogDescription>
                    Click submit when you&apos;re done.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AddNewAcademic
                  onAcademicAdded={handleProductAdded}
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
  );
};

export default AcademicGownInventory;
