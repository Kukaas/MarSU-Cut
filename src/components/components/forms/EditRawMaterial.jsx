// UI
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";

// others
import { EditRawMAterialsSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import ToasterError from "@/lib/Toaster";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import CustomNumberInput from "../custom-components/CustomNumberInput";
import SelectField from "../custom-components/SelectField";
import ImageUpload from "../custom-components/ImageUpload";

const EditRawMaterial = ({ selectedRawMaterial }) => {
  const [editRawMaterialLoading, setEditRawMaterialLoading] = useState(false);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [rawMaterialTypes, setRawMaterialTypes] = useState([]);
  const [filteredRawMaterialTypes, setFilteredRawMaterialTypes] = useState([]);
  const [units, setUnits] = useState([]);

  const editRawMaterialForm = useForm({
    resolver: zodResolver(EditRawMAterialsSchema),
    defaultValues: {
      category: selectedRawMaterial?.category,
      type: selectedRawMaterial?.type,
      quantity: selectedRawMaterial?.quantity,
      unit: selectedRawMaterial?.unit,
      image: selectedRawMaterial?.image,
    },
  });

  useEffect(() => {
    const fetchRawMaterialTypes = async () => {
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
          // Step 1: Get unique categories
          const uniqueCategories = [
            ...new Set(data.map((item) => item.category)),
          ];

          // Step 2: Group raw material types by category
          const groupedArray = uniqueCategories.map((category) => {
            return {
              category,
              items: data.filter((item) => item.category === category),
            };
          });

          setRawMaterialTypes(groupedArray);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRawMaterialTypes();
  }, []);

  useEffect(() => {
    if (editRawMaterialForm.watch("category")) {
      const selectedCategory = editRawMaterialForm.watch("category");
      const categoryData = rawMaterialTypes.find(
        (group) => group.category === selectedCategory
      );
      setFilteredRawMaterialTypes(categoryData ? categoryData.items : []);
    }
  }, [editRawMaterialForm.watch("category"), rawMaterialTypes]);

  useEffect(() => {
    if (editRawMaterialForm.watch("type")) {
      const selectedType = editRawMaterialForm.watch("type");
      const selectedItem = filteredRawMaterialTypes.find(
        (item) => item.rawMaterialType === selectedType
      );
      if (selectedItem) {
        setUnits([selectedItem.unit]);
      }
    }
  }, [editRawMaterialForm.watch("type"), filteredRawMaterialTypes]);

  const handleEditRawMaterial = async (values) => {
    if (!values.quantity || !values.type || !values.unit) {
      return toast.error("Please fill all fields");
    }

    try {
      setEditRawMaterialLoading(true);

      // Include the uploaded image URL if available
      const updatedValues = {
        ...values,
        image: imageFileUrl || values.image, // Use the uploaded URL or fallback to existing value
      };

      const res = await axios.put(
        `${BASE_URL}/api/v1/raw-materials/update/${selectedRawMaterial._id}`,
        updatedValues, // Pass the updated values
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success("Raw material updated successfully");
        editRawMaterialForm.reset(); // Reset the form after successful update
      } else {
        toast.error("Failed to update raw material");
      }
    } catch (error) {
      console.error("Error updating raw material:", error);
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    } finally {
      setEditRawMaterialLoading(false);
    }
  };

  return (
    <Form {...editRawMaterialForm}>
      <form
        onSubmit={editRawMaterialForm.handleSubmit(handleEditRawMaterial)}
        className="space-y-4 w-full p-3"
      >
        <FormField
          control={editRawMaterialForm.control}
          name="category"
          render={({ field }) => (
            <SelectField
              field={field}
              label="Category"
              options={rawMaterialTypes.map(
                (rawMaterialType) => rawMaterialType.category
              )}
              placeholder="Select a category"
            />
          )}
        />
        <FormField
          control={editRawMaterialForm.control}
          name="type"
          render={({ field }) => (
            <SelectField
              field={field}
              label="Raw Material Type"
              options={
                rawMaterialTypes
                  .flatMap((group) => group.items) // Flatten the items array from each category
                  .map((item) => item.rawMaterialType) // Extract just the raw material type names as an array
              }
              placeholder="Select a raw material type"
            />
          )}
        />
        <FormField
          control={editRawMaterialForm.control}
          name="unit"
          render={({ field }) => (
            <SelectField
              field={field}
              label="Unit"
              options={units}
              placeholder="Unit"
            />
          )}
        />

        <CustomNumberInput
          control={editRawMaterialForm.control}
          label="Quantity"
          name="quantity"
          placeholder="Quantity"
          type="number"
        />
        <ImageUpload
          onImageUpload={setImageFileUrl}
          defaultImageUrl={selectedRawMaterial?.image}
        />
        <div className="flex flex-col items-center gap-4 mt-4">
          <AlertDialogFooter className="w-full flex flex-col items-center gap-4">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="submit"
              disabled={editRawMaterialLoading}
              className="w-full flex items-center justify-center"
            >
              {editRawMaterialLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 animate-spin" />
                  <span>Updating</span>
                </div>
              ) : (
                "Update"
              )}
            </Button>
          </AlertDialogFooter>
        </div>
      </form>
    </Form>
  );
};

EditRawMaterial.propTypes = {
  selectedRawMaterial: PropTypes.object,
};

export default EditRawMaterial;
