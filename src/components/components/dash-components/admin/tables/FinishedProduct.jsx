// UI
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Spin, Tooltip, Typography } from "antd";

import { PlusCircle } from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";

// others
import { useEffect, useState } from "react";
import axios from "axios";
import ToasterError from "@/lib/Toaster";

import EditProduct from "@/components/components/forms/EditProduct";
import AddNewProduct from "@/components/components/forms/AddNewProduct";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/custom-components/CustomTable";
import { statusColors } from "@/lib/utils";
import CustomBadge from "@/components/components/custom-components/CustomBadge";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import DeleteDialog from "@/components/components/custom-components/DeleteDialog";

const FinishedProduct = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchFinishedProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/v1/finished-product/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const data = res.data;
        setData(data.finishedProducts);
        setOriginalData(data.finishedProducts);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchFinishedProduct();
  }, []);

  useEffect(() => {
    if (searchValue) {
      const lowercasedSearchValue = searchValue.toLowerCase();

      const filteredData = originalData.filter((production) => {
        return (
          production.productType
            .toLowerCase()
            .includes(lowercasedSearchValue) ||
          production.level.toLowerCase().includes(lowercasedSearchValue)
        );
      });

      setData(filteredData);
    } else {
      setData(originalData);
    }
  }, [searchValue, originalData]);

  const handleDelete = async (product) => {
    try {
      setDeleteLoading(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/finished-product/delete/${product._id}`,
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
          prevData.filter(
            (finishedProduct) => finishedProduct._id !== product._id
          )
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

  const handleProductUpdated = (updatedProduct) => {
    setData((prevData) =>
      prevData.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(product);
                    }}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                      Please fill out the form below to edit product.
                    </DialogDescription>
                  </DialogHeader>
                  <EditProduct
                    selectedProduct={selectedProduct}
                    setIsDialogOpen={setIsDialogOpen}
                    onProductUpdated={handleProductUpdated}
                  />
                </DialogContent>
              </Dialog>
            </Tooltip>
            <Tooltip title="Delete product">
              <DeleteDialog
                item={`raw material with ID ${product?._id}`}
                handleDelete={() => handleDelete(product)}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const handleProductAdded = (newProduct) => {
    setData((prevData) => [...prevData, newProduct]);
  };

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
            Finished Products Inventory
          </Typography.Title>
          <div className="flex flex-wrap items-center justify-between pb-2">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <Input
                placeholder="Filter by product type or level..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-8 w-[270px]"
              />
            </div>
            <Tooltip title="Add new product">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" className="m-2 h-8">
                    <PlusCircle size={20} className="mr-2 h-4 w-4" />
                    New Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add a new product</DialogTitle>
                    <DialogDescription>
                      Click submit when you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <AddNewProduct
                    onProductAdded={handleProductAdded}
                    setIsDialogOpen={setIsDialogOpen}
                  />
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
      </div>
    </Spin>
  );
};

export default FinishedProduct;
