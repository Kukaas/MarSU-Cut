import CustomInput from "@/components/components/custom-components/CustomInput";
import CustomTable from "@/components/components/custom-components/CustomTable";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
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
import { Form } from "@/components/ui/form";
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

  const form = useForm({
    resolver: zodResolver(addNewProductTypeSchema),
    defaultValues: {
      productType: "",
    },
  });

  const updateForm = useForm({
    resolver: zodResolver(addNewProductTypeSchema),
    defaultValues: {
      productType: "",
    },
  });

  useEffect(() => {
    const fetchProductTypes = async () => {
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

  const handleAddNewProductType = async (values) => {
    if (!values.productType) {
      return toast.error("Please fill all fields");
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/system-maintenance/product-type/create`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        toast.success("Product type added successfully");
        setProductTypes([...productTypes, res.data.newProductType]);
        form.reset();
        setCreateDialogOpen(false);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error("Product type already exists");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProductType = async (values) => {
    if (!values.productType) {
      return toast.error("Please fill all fields");
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/system-maintenance/product-type/update/${selectedProductType._id}`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success("Product type updated successfully");
        const updatedProductTypes = productTypes.map((productType) =>
          productType._id === selectedProductType._id
            ? res.data.updatedProductType
            : productType
        );
        setProductTypes(updatedProductTypes);
        setUpdateDialogOpen(false);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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

  const columns = [
    {
      accessorKey: "productType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product Type" />
      ),
    },
    {
      accessorKey: "Actions",
      header: "Actions",
      cell: (row) => {
        const productType = row.row.original;

        return (
          <div className="flex items-center space-x-2">
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  onClick={() => {
                    setSelectedProductType(productType);
                    setUpdateDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
              </AlertDialogTrigger>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  variant="destructive"
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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add New Product Type</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Fill in the form below to add a new product type
            </AlertDialogDescription>
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(handleAddNewProductType)}
              >
                <CustomInput
                  form={form}
                  name="productType"
                  label="Product Type"
                  placeholder="eg, POLO, SKIRT, PANTS"
                  type="text"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 animate-spin" />
                        <span>Adding</span>
                      </div>
                    ) : (
                      "Add Product Type"
                    )}
                  </Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <CustomTable columns={columns} data={productTypes} loading={false} />

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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Product Type</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Fill in the form below to update the product type
          </AlertDialogDescription>
          <Form {...updateForm}>
            <form
              className="space-y-4"
              onSubmit={updateForm.handleSubmit(handleUpdateProductType)}
            >
              <CustomInput
                form={updateForm}
                name="productType"
                label="Product Type"
                placeholder="eg, POLO, SKIRT, PANTS"
                type="text"
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 animate-spin" />
                      <span>Updating</span>
                    </div>
                  ) : (
                    "Update Product Type"
                  )}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductTypes;
