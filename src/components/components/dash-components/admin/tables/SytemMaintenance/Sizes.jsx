import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

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

// Define the schema for size
const addNewSizeSchema = z.object({
  size: z.string().min(1, "Size is required"),
});

const Sizes = () => {
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(addNewSizeSchema),
    defaultValues: {
      size: "",
    },
  });

  const updateForm = useForm({
    resolver: zodResolver(addNewSizeSchema),
    defaultValues: {
      size: "",
    },
  });

  useEffect(() => {
    const fetchSizes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/system-maintenance/size/all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setSizes(res.data.sizes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sizes:", error);
        toast.error("Failed to fetch sizes");
        setLoading(false);
      }
    };

    fetchSizes();
  }, []);

  useEffect(() => {
    if (selectedSize) {
      updateForm.reset({
        size: selectedSize.size,
      });
    }
  }, [selectedSize, updateForm]);

  const handleAddNewSize = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/system-maintenance/size/create`,
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
        toast.success("Size added successfully");
        setSizes([...sizes, res.data.newSize]);
        form.reset();
        setCreateDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 400) {
        toast.error("Size already exists");
      } else {
        toast.error("Failed to add size");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSize = async (values) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/system-maintenance/size/update/${selectedSize._id}`,
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
        toast.success("Size updated successfully");
        const updatedSizes = sizes.map((size) =>
          size._id === selectedSize._id ? res.data.updatedSize : size
        );
        setSizes(updatedSizes);
        setUpdateDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update size");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSize = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/system-maintenance/size/delete/${selectedSize._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success("Size deleted successfully");
        setSizes(sizes.filter((size) => size._id !== selectedSize._id));
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete size");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: "size",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Size" />
      ),
    },
    {
      accessorKey: "Actions",
      header: "Actions",
      cell: (row) => {
        const size = row.row.original;

        return (
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                setSelectedSize(size);
                setUpdateDialogOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setSelectedSize(size);
                setDeleteDialogOpen(true);
              }}
            >
              Delete
            </Button>
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
              Add Size
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add New Size</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Enter the new size below
            </AlertDialogDescription>
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(handleAddNewSize)}
              >
                <CustomInput
                  form={form}
                  name="size"
                  label="Size"
                  placeholder="e.g., S16, S17, S18"
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
                      "Add Size"
                    )}
                  </Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <CustomTable columns={columns} data={sizes} loading={loading} />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Size</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete {selectedSize?.size}?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteSize}
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
            <AlertDialogTitle>Update Size</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>Update the size below</AlertDialogDescription>
          <Form {...updateForm}>
            <form
              className="space-y-4"
              onSubmit={updateForm.handleSubmit(handleUpdateSize)}
            >
              <CustomInput
                form={updateForm}
                name="size"
                label="Size"
                placeholder="e.g., S, M, L, XL"
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
                    "Update Size"
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

export default Sizes;
