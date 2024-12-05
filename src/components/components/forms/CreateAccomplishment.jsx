import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ToasterError from "@/lib/Toaster";
import { CreateAccomplishmentSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomInput from "../custom-components/CustomInput";
import SelectField from "../custom-components/SelectField";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { fetchEmployees, fetchProductTypes } from "@/hooks/helper";

const CreateAccomplishment = ({ onAccomplishmentCreate, setIsDialogOpen }) => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const form = useForm({
    resolver: zodResolver(CreateAccomplishmentSchema),
    defaultValues: {
      assignedEmployee: "",
      accomplishmentType: "",
      product: "",
      quantity: 0,
    },
  });

  const { watch } = form; // Watch for changes in form

  const selectedEmployeeName = watch("assignedEmployee");

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const employeeData = await fetchEmployees();
        setEmployees(employeeData);
        if (employeeData.length > 0) {
          setSelectedEmployee(
            employeeData.find((e) => e.name === selectedEmployeeName)
          );
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    getEmployees();
  }, [selectedEmployeeName]); // Re-run when selectedEmployee changes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productTypesData = await fetchProductTypes();
        const uniqueProductTypes = Array.from(
          new Set(productTypesData.map((a) => a.productType))
        ).map((productType) => {
          return productTypesData.find((a) => a.productType === productType);
        });

        setProductTypes(uniqueProductTypes);
      } catch (error) {
        console.error("Failed to load product types:", error);
      }
    };

    fetchData();
  }, []);

  const accomplishmentOptions = selectedEmployee
    ? selectedEmployee.jobRole.includes("Pattern Maker") &&
      selectedEmployee.jobRole.includes("Cutting Specialist")
      ? ["Cutting", "Pattern Making"]
      : selectedEmployee.jobRole.includes("Tailoring Specialist")
      ? ["Sewing"]
      : ["Cutting", "Sewing", "Pattern Making"] // Default options
    : ["Cutting", "Sewing", "Pattern Making"]; // Fallback if no employee selected

  const handleCreateAccomplishment = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/accomplishment-report/create`,
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
        setLoading(false);
        toast.success("Accomplishment report created successfully!");
        form.reset();
        onAccomplishmentCreate(res.data.accomplishmentReport);
        setIsDialogOpen(false);
        console.log(res.data);
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateAccomplishment)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="assignedEmployee"
              render={({ field }) => (
                <SelectField
                  field={field}
                  label="Assigned Employee"
                  options={employees.map((employee) => employee.name)}
                  placeholder="Select an employee"
                />
              )}
            />
            <FormField
              control={form.control}
              name="accomplishmentType"
              render={({ field }) => (
                <SelectField
                  field={field}
                  label="Accomplishment Type"
                  options={accomplishmentOptions}
                  placeholder="Select a Type"
                />
              )}
            />
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <SelectField
                  field={field}
                  label="Product Type"
                  options={productTypes.map((type) => type.productType)}
                  placeholder="Select a product"
                />
              )}
            />
            <CustomInput
              form={form}
              name="quantity"
              label="Quantity"
              type="number"
              placeholder="Enter quantity"
            />
            <div className="flex flex-col items-center gap-4 mt-4">
              <AlertDialogFooter className="flex flex-col items-center gap-4 w-full">
                <AlertDialogCancel asChild>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </AlertDialogCancel>

                <Button
                  type="submit"
                  variant="default"
                  disabled={loading}
                  className="w-full flex items-center justify-center"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 animate-spin" />
                      <span>Creating</span>
                    </div>
                  ) : (
                    "Create"
                  )}
                </Button>
              </AlertDialogFooter>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

CreateAccomplishment.propTypes = {
  onAccomplishmentCreate: PropTypes.func,
  setIsDialogOpen: PropTypes.func,
};

export default CreateAccomplishment;
