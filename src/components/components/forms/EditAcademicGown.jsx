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

const EditAcademicGown = ({
  selectedProduct,
  onAcademicUpdated,
  setIsDialogOpen,
}) => {
  const [editAcademicLoading, setEditAcademicLoading] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [allSizes, setAllSizes] = useState([]);

  // Pre-fill form with existing data
  const editAcademicForm = useForm({
    resolver: zodResolver(addNewAcademicSchema),
    defaultValues: {
      level: selectedProduct.level || "",
      productType: selectedProduct.productType || "ACADEMIC GOWN",
      department: selectedProduct.department || "",
      size: selectedProduct.size || "",
      quantity: selectedProduct.quantity || 0,
      status: selectedProduct.status || "AVAILABLE",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productTypesData = await fetchProductTypes();
        const uniqueProductTypes = Array.from(
          new Set(productTypesData.map((a) => a.productType))
        ).map((productType) => ({
          productType,
        }));

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

  const handleEditAcademic = async (values) => {
    if (
      !values.level ||
      !values.department ||
      !values.size ||
      !values.quantity
    ) {
      return toast.error("Please fill all fields");
    }

    try {
      setEditAcademicLoading(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/academic-gown/update/${selectedProduct._id}`,
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
        setEditAcademicLoading(false);
        toast.success("Academic gown updated successfully!");
        onAcademicUpdated(res.data.selectedProduct);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    } finally {
      setEditAcademicLoading(false);
    }
  };

  return (
    <Form {...editAcademicForm}>
      <form
        onSubmit={editAcademicForm.handleSubmit(handleEditAcademic)}
        className="space-y-4 w-full p-3"
      >
        <FormField
          control={editAcademicForm.control}
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
          control={editAcademicForm.control}
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
          control={editAcademicForm.control}
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
          control={editAcademicForm.control}
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
          control={editAcademicForm.control}
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
              disabled={editAcademicLoading}
              className="flex items-center justify-center w-full"
            >
              {editAcademicLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 animate-spin" />
                  <span>Saving</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </AlertDialogFooter>
        </div>
      </form>
    </Form>
  );
};

EditAcademicGown.propTypes = {
  selectedProduct: PropTypes.object.isRequired,
  onAcademicUpdated: PropTypes.func,
  setIsDialogOpen: PropTypes.func.isRequired,
};

export default EditAcademicGown;
