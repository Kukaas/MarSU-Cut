import CustomInput from "@/components/components/custom-components/CustomInput";
import CustomTable from "@/components/components/custom-components/CustomTable";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import SelectField from "@/components/components/custom-components/SelectField";
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
import { Form, FormField } from "@/components/ui/form";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import { addNewEmployeeSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Employees = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  const form = useForm({
    resolver: zodResolver(addNewEmployeeSchema),
    defaultValues: {
      name: "",
      jobRole: "",
      address: "",
      contact: "",
    },
  });

  const updateForm = useForm({
    resolver: zodResolver(addNewEmployeeSchema),
    defaultValues: {
      name: "",
      jobRole: "",
      address: "",
      contact: "",
    },
  });

  useEffect(() => {
    if (selectedEmployee) {
      updateForm.reset({
        name: selectedEmployee.name,
        jobRole: selectedEmployee.jobRole,
        address: selectedEmployee.address,
        contact: selectedEmployee.contact,
      });
    }
  }, [selectedEmployee, updateForm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/v1/system-maintenance/employee/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setEmployees(res.data.employees || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "jobRole",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Position" />
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "contact",
      header: "Contact",
    },
    {
      accessorKey: "Actions",
      header: "Actions",
      cell: (row) => {
        const employee = row.row.original;

        return (
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                setSelectedEmployee(employee);
                setUpdateDialogOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setSelectedEmployee(employee);
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

  const handleAddNewEmployee = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/system-maintenance/employee/new`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      // Update the employee list with the newly added employee
      if (res.status === 201) {
        fetchData();
        setLoading(false);
        setCreateDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error.response.status === 400) {
        toast.error("Employee already exist");
      }
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${BASE_URL}/api/v1/system-maintenance/employee/delete/${selectedEmployee._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success("Employee deleted successfully");
        setEmployees(
          employees.filter((employee) => employee._id !== selectedEmployee._id)
        );
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployee = async (values) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/system-maintenance/employee/update/${selectedEmployee._id}`,
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
        toast.success("Employee updated successfully");
        fetchData();
        setUpdateDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 400) {
        toast.error("Name already exist");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-5 h-screen">
      <div className="flex justify-end">
        <AlertDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <AlertDialogTrigger>
            <Button className="mb-2" onClick={() => setCreateDialogOpen(true)}>
              Add Employee
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add New Employee</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Enter the employee information below
            </AlertDialogDescription>
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(handleAddNewEmployee)}
              >
                <CustomInput
                  form={form}
                  name="name"
                  label="Name"
                  placeholder="e.g. Jhon Doe"
                  type="text"
                />
                <CustomInput
                  form={form}
                  name="address"
                  label="Address"
                  placeholder="e.g. Tanza, Boac, Marinduque"
                  type="text"
                />
                <CustomInput
                  form={form}
                  name="contact"
                  label="Contact"
                  placeholder="e.g. 0912134567890"
                  type="text"
                />
                <FormField
                  control={form.control}
                  name="jobRole"
                  render={({ field }) => (
                    <SelectField
                      field={field}
                      label="Job Role"
                      options={[
                        "Tailoring Specialist",
                        "Pattern Maker",
                        "Production Technician",
                      ]}
                      placeholder="Job Role"
                    />
                  )}
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
                      "Add Employee"
                    )}
                  </Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <CustomTable columns={columns} data={employees} loading={loading} />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Size</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete {selectedEmployee?.size}?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteEmployee}
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
            <AlertDialogTitle>Edit Employee</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {selectedEmployee
              ? `Edit information of employee ${selectedEmployee.name}`
              : "Loading employee data..."}
          </AlertDialogDescription>

          <Form {...updateForm}>
            <form
              className="space-y-4"
              onSubmit={updateForm.handleSubmit(handleUpdateEmployee)}
            >
              <CustomInput
                form={updateForm}
                name="name"
                label="Name"
                placeholder="e.g. Jhon Doe"
                type="text"
              />
              <CustomInput
                form={updateForm}
                name="address"
                label="Address"
                placeholder="e.g. Tanza, Boac, Marinduque"
                type="text"
              />
              <CustomInput
                form={updateForm}
                name="contact"
                label="Contact"
                placeholder="e.g. 0912134567890"
                type="text"
              />
              <FormField
                control={updateForm.control}
                name="jobRole"
                render={({ field }) => (
                  <SelectField
                    field={field}
                    label="Job Role"
                    options={[
                      "Tailoring Specialist",
                      "Pattern Maker",
                      "Production Technician",
                    ]}
                    placeholder="Job Role"
                  />
                )}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 animate-spin" />
                      <span>Update</span>
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

export default Employees;
