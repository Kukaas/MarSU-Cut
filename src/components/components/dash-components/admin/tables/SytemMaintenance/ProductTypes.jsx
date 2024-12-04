import CustomTable from "@/components/components/custom-components/CustomTable";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import AddProductTypeForm from "@/components/components/forms/AddProductTypeForm";
import EditProductTypeForm from "@/components/components/forms/EditProductTypeForm";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import { addNewProductTypeSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ProductTypes = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateForm = useForm({
    resolver: zodResolver(addNewProductTypeSchema),
    defaultValues: {
      productType: "",
    },
  });

  useEffect(() => {
    const fetchProductTypes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/system-maintenance/product-type/all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setProductTypes(res.data.productTypes);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchProductTypes();
  }, []);

  // Update form default values when selectedProductType changes
  useEffect(() => {
    if (selectedProductType) {
      updateForm.reset({
        productType: selectedProductType.productType,
      });
    }
  }, [selectedProductType, updateForm]);

  const handleDeleteProductType = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/v1/system-maintenance/product-type/delete/${selectedProductType._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setLoading(false);
        toast.success("Product type deleted successfully");
        setProductTypes(
          productTypes.filter(
            (productType) => productType._id !== selectedProductType._id
          )
        );
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewProductType = (newProductType) => {
    setProductTypes([...productTypes, newProductType]);
    setLoading(false);
    setCreateDialogOpen(false);
  };

  const handleUpdateProductType = (updatedProductType) => {
    const updatedProductTypes = productTypes.map((productType) =>
      productType._id === updatedProductType._id
        ? updatedProductType
        : productType
    );
    setProductTypes(updatedProductTypes);
    setLoading(false);
    setUpdateDialogOpen(false);
  };

  const columns = [
    {
      accessorKey: "level",
      header: "Level",
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
      header: "Raw Materials Used",
      accessorKey: "rawMaterialsUsed",
      cell: ({ row }) => {
        const rawMaterialsUsed = row.original.rawMaterialsUsed || [];

        return (
          <div className="space-y-1">
            {rawMaterialsUsed.map((item, index) => (
              <div
                key={index}
                className="flex flex-wrap items-center gap-1 text-xs"
              >
                <span className="font-bold">{item.category}:</span>
                <span className="font-semibold">{item.type}</span>
                <span>-</span>
                <span className="font-semibold">{item.quantity}</span>
                <span className="font-semibold">{item.unit}</span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "Actions",
      header: "Actions",
      cell: (row) => {
        const productType = row.row.original;

        return (
          <div className="flex items-center space-x-2">
            {/* Edit Button */}
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => {
                    setSelectedProductType(productType);
                    setUpdateDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
              </AlertDialogTrigger>
            </AlertDialog>

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() => {
                    setSelectedProductType(productType);
                    setDeleteDialogOpen(true);
                  }}
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full p-5 h-screen">
      <div className="flex justify-end">
        <AlertDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <AlertDialogTrigger>
            <Button className="mb-2" onClick={() => setCreateDialogOpen(true)}>
              Add Product Type
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[500px] max-h-[600px] overflow-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Add New Product Type</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Fill in the form below to add a new product type
            </AlertDialogDescription>
            <AddProductTypeForm
              onClose={() => setCreateDialogOpen(false)}
              onSuccess={handleNewProductType}
              loading={loading}
            />
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <CustomTable columns={columns} data={productTypes} loading={loading} />

      {/* Delete Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onDismiss={() => setDeleteDialogOpen(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product Type</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete {selectedProductType?.productType}?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteProductType}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 animate-spin" />
                  <span>Deleting</span>
                </div>
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Dialog */}
      <AlertDialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <AlertDialogContent className="max-w-[500px] max-h-[600px] overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Product Type</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Fill in the form below to update the product type
          </AlertDialogDescription>
          <EditProductTypeForm
            onClose={() => setCreateDialogOpen(false)}
            onSuccess={handleUpdateProductType}
            selectedProductType={selectedProductType}
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductTypes;
