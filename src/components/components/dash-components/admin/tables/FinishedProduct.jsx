// UI
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Spin, Tooltip, Typography } from "antd";

import { Loader2, PlusCircle } from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";

// others
import { useEffect, useState } from "react";
import axios from "axios";
import ToasterError from "@/lib/Toaster";

import EditProduct from "@/components/components/forms/EditProduct";
import AddNewProduct from "@/components/components/forms/AddNewProduct";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomTable from "@/components/components/CustomTable";
import { statusColors } from "@/lib/utils";
import CustomBadge from "@/components/components/CustomBadge";

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

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/finished-product/delete/${selectedProduct._id}`,
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
          prevData.filter((product) => product._id !== selectedProduct._id)
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
      accessorKey: "level",
      header: "Level",
    },
    {
      accessorKey: "productType",
      header: "Product Type",
    },
    {
      accessorKey: "size",
      header: "Size",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "status",
      header: "Status",
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
        const product = row.original;
        return (
          <div className="flex items-center justify-center space-x-2">
            <Tooltip title="Edit product">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setSelectedProduct(product)}
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
                  <EditProduct selectedProduct={selectedProduct} />
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
                      setSelectedProduct(product);
                    }}
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Product</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this product?
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
            Finished Products Inventory
          </Typography.Title>
          <div className="flex items-center py-4 justify-between">
            <div className="flex items-center w-[300px]">
              <Input
                placeholder="Search by product type or level..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <Tooltip title="Add new product">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className="m-2">
                    <PlusCircle size={20} className="mr-2" />
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
                  <AddNewProduct />
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
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Please fill out the form below to add new product.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </Spin>
  );
};

export default FinishedProduct;
