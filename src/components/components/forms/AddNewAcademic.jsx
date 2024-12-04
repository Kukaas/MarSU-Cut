// UI
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// icons
import { Loader2 } from "lucide-react";

// others
import ToasterError from "@/lib/Toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import SelectField from "../custom-components/SelectField";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import CustomNumberInput from "../custom-components/CustomNumberInput";
import { fetchProductTypes, fetchSizes } from "@/hooks/helper";
import { addNewAcademicSchema } from "@/schema/shema";

const AddNewAcademic = ({ onAcademicAdded, setIsDialogOpen }) => {
  const [addNewAcademicLoading, setAddNewAcademicLoading] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [allSizes, setAllSizes] = useState([]);

  const addNewAcademicForm = useForm({
    resolver: zodResolver(addNewAcademicSchema),
    defaultValues: {
      level: "",
      productType: "ACADEMIC GOWN",
      department: "",
      size: "",
      quantity: 0,
      status: "AVAILABLE",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productTypesData = await fetchProductTypes();
        // remove duplication of product types
        const uniqueProductTypes = Array.from(
          new Set(productTypesData.map((a) => a.productType))
        ).map((productType) => {
          return {
            productType,
          };
        });

        // Remove TOGA, CAP, HOOD
        const filteredProductTypes = uniqueProductTypes.filter(
          (item) =>
            item.productType !== "POLO" &&
            item.productType !== "SKIRT" &&
            item.productType !== "BLOUSE" &&
            item.productType !== "PANTS"
        );

        setProductTypes(filteredProductTypes);
      } catch (error) {
        console.error("Failed to load product types:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch sizes for all gowns on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sizesData = await fetchSizes();

        setAllSizes(sizesData);
      } catch (error) {
        console.error("Failed to load sizes:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddNewAcademic = async (values) => {
    if (
      !values.level ||
      !values.department ||
      !values.size ||
      !values.quantity
    ) {
      return toast.error("Please fill all fields");
    }
    try {
      setAddNewAcademicLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/academic-gown/add`,
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
        setAddNewAcademicLoading(false);
        toast.success("Academic gown added successfully!");
        addNewAcademicForm.reset();
        onAcademicAdded(res.data.academicGown);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.log(error);
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    } finally {
      setAddNewAcademicLoading(false);
    }
  };

  return (
    <Form {...addNewAcademicForm}>
      <form
        onSubmit={addNewAcademicForm.handleSubmit(handleAddNewAcademic)}
        className="space-y-4 w-full p-3"
      >
        <FormField
          control={addNewAcademicForm.control}
          name="level"
          render={({ field }) => (
            <SelectField
              field={field}
              label="Level"
              options={["SHS", "COLLEGE"]}
              placeholder="Level"
            />
          )}
        />
        <FormField
          control={addNewAcademicForm.control}
          name="productType"
          render={({ field }) => (
            <SelectField
              field={field}
              label="Product Type"
              options={productTypes.map((type) => type.productType)}
              placeholder="Select Product Type"
            />
          )}
        />
        <FormField
          control={addNewAcademicForm.control}
          name="department"
          render={({ field }) => (
            <SelectField
              field={field}
              label="Department"
              options={[
                "College of Agriculture(Torrijos Campus)",
                "College of Allied Health Sciences",
                "College of Arts and Social Sciences",
                "College of Business and Accountancy",
                "College of Criminal Justice Education",
                "College of Education",
                "College of Engineering",
                "College of Environmental Studies",
                "College of Fisheries and Aquatic Sciences(Gasan Campus)",
                "College of Governance",
                "College of Industrial Technology",
                "College of Information and Computing Sciences",
                "No Department",
              ]}
              placeholder="Select Department"
            />
          )}
        />
        <FormField
          control={addNewAcademicForm.control}
          name="size"
          render={({ field }) => (
            <SelectField
              field={field}
              label="Size"
              options={allSizes.map((size) => size.size)}
              placeholder="Size"
            />
          )}
        />

        <CustomNumberInput
          control={addNewAcademicForm.control}
          label="Quantity"
          name="quantity"
          placeholder="Quantity"
          type="number"
        />
        <div className="flex flex-col items-center gap-4">
          <AlertDialogFooter className="flex flex-col items-center gap-4 w-full">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </AlertDialogCancel>

            <Button
              type="submit"
              disabled={addNewAcademicLoading}
              className="flex items-center justify-center w-full"
            >
              {addNewAcademicLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 animate-spin" />
                  <span>Adding</span>
                </div>
              ) : (
                "Add Academic Gown"
              )}
            </Button>
          </AlertDialogFooter>
        </div>
      </form>
    </Form>
  );
};

AddNewAcademic.propTypes = {
  onAcademicAdded: PropTypes.func,
  setIsDialogOpen: PropTypes.func,
};

export default AddNewAcademic;
