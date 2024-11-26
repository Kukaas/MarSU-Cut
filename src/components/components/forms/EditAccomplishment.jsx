import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { EditAccomplishmentSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import CustomInput from "../custom-components/CustomInput";
import SelectField from "../custom-components/SelectField";
import { Form, FormField } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { fetchEmployees, fetchProductTypes } from "@/hooks/helper";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";

const EditAccomplishment = ({ accomplishment, onAccomplishmentUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  const form = useForm({
    resolver: zodResolver(EditAccomplishmentSchema),
    defaultValues: {
      assignedEmployee: accomplishment.assignedEmployee,
      accomplishmentType: accomplishment.accomplishmentType,
      product: accomplishment.product,
      quantity: accomplishment.quantity,
    },
  });

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const employeeData = await fetchEmployees();
        setEmployees(employeeData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    getEmployees();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productTypesData = await fetchProductTypes();
        setProductTypes(productTypesData);
      } catch (error) {
        console.error("Failed to load product types:", error);
      }
    };

    fetchData();
  }, []);

  const HandleUpdate = async (data) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/accomplishment-report/update/${accomplishment._id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Accomplishment updated successfully!");
        onAccomplishmentUpdate(response.data.accomplishmentReport);
      } else {
        throw new Error("Failed to update accomplishment");
      }
    } catch (error) {
      console.error("Error updating accomplishment:", error);
      toast.error("Failed to update accomplishment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(HandleUpdate)}
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
                  options={["Cutting", "Sewing", "Pattern Making"]}
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
                      <span>Update</span>
                    </div>
                  ) : (
                    "Updating"
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

export default EditAccomplishment;
