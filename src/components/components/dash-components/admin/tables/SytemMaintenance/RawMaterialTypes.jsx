import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

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
import { addNewRawMaterialTypeSchema } from "@/schema/shema";
import axios from "axios";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import { toast } from "sonner";

const RawMaterialTypes = () => {
  const [loading, setLoading] = useState(false);
  const [rawMaterialTypes, setRawMaterialTypes] = useState([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedRawMaterialType, setSelectedRawMaterialType] = useState(null);

  const form = useForm({
    resolver: zodResolver(addNewRawMaterialTypeSchema),
    defaultValues: {
      rawMaterialType: "",
    },
  });

  const updateForm = useForm({
    resolver: zodResolver(addNewRawMaterialTypeSchema),
    defaultValues: {
      rawMaterialType: "",
    },
  });

  const fetchRawMaterialTypesData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/system-maintenance/raw-material-type/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const data = res.data.rawMaterialTypes;
      if (res.status === 200) {
        setRawMaterialTypes(data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRawMaterialTypesData();
  }, []);

  useEffect(() => {
    if (selectedRawMaterialType) {
      updateForm.setValue(
        "rawMaterialType",
        selectedRawMaterialType.rawMaterialType
      );
    }
  }, [selectedRawMaterialType, updateForm]);

  const columns = [
    {
      accessorKey: "rawMaterialType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Raw Material Type" />
      ),
    },
    {
      accessorKey: "Actions",
      header: "Actions",
      cell: (row) => {
        const rawMaterialType = row.row.original;

        return (
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                setSelectedRawMaterialType(rawMaterialType);
                setUpdateDialogOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setSelectedRawMaterialType(rawMaterialType);
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

  const handleAddNewRawMaterialType = async (data) => {
    setLoading(true);
    try {
      const newRawMaterialType = await axios.post(
        `${BASE_URL}/api/v1/system-maintenance/raw-material-type/create`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("New raw material type added successfully");
      setRawMaterialTypes([...rawMaterialTypes, newRawMaterialType]);
      setCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to add new raw material type");
      console.error("Failed to add new raw material type:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRawMaterialType = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${BASE_URL}/api/v1/system-maintenance/raw-material-type/delete/${selectedRawMaterialType._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Raw material type deleted successfully");
      fetchRawMaterialTypesData();
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete raw material type");
      console.error("Failed to delete raw material type:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRawMaterialType = async (data) => {
    setLoading(true);
    try {
      await axios.put(
        `${BASE_URL}/api/v1/system-maintenance/raw-material-type/update/${selectedRawMaterialType._id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Raw material type updated successfully");
      fetchRawMaterialTypesData();

      setUpdateDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update raw material type");
      console.error("Failed to update raw material type:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-5 h-screen">
      <div className="flex justify-end">
        <AlertDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button className="mb-2">Add Raw Material Type</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add Raw Material Type</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Click submit when you&apos;re done.
            </AlertDialogDescription>
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(handleAddNewRawMaterialType)}
              >
                <CustomInput
                  form={form}
                  name="rawMaterialType"
                  label="Raw Material Type"
                  placeholder="e.g. Fabric, Thread, etc."
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
                      "Add Raw Material Type"
                    )}
                  </Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <CustomTable
        columns={columns}
        data={rawMaterialTypes}
        loading={loading}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Raw Material Type</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            {selectedRawMaterialType?.rawMaterialType}?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteRawMaterialType}
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

      {/* Edit Dialog */}
      <AlertDialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Raw Material Type</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {selectedRawMaterialType
              ? `Edit information of Raw Material Type ${selectedRawMaterialType.rawMaterialType}`
              : "Loading Raw Material Type data..."}
          </AlertDialogDescription>

          <Form {...updateForm}>
            <form
              className="space-y-4"
              onSubmit={updateForm.handleSubmit(handleUpdateRawMaterialType)}
            >
              <CustomInput
                form={updateForm}
                name="rawMaterialType"
                label="Raw Material Type"
                placeholder="e.g. Fabric, CVC Cream, etc."
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
                    "Update"
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

export default RawMaterialTypes;
