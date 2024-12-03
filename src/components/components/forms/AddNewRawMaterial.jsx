import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2} from "lucide-react";
import ToasterError from "@/lib/Toaster";
import PropTypes from "prop-types";
import { AddRawMaterialsSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import SelectField from "../custom-components/SelectField";
import CustomNumberInput from "../custom-components/CustomNumberInput";
import ImageUpload from "../custom-components/ImageUpload";

const AddNewRawMaterial = ({ onRawMaterialAdded, setIsDialogOpen }) => {
  const [addRawMaterialLoading, setAddRawMaterialLoading] = useState(false);
  const [rawMaterialTypes, setRawMaterialTypes] = useState([]);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [filteredRawMaterialTypes, setFilteredRawMaterialTypes] = useState([]);
  const [units, setUnits] = useState([]);

  const addRawMaterialForm = useForm({
    resolver: zodResolver(AddRawMaterialsSchema),
    defaultValues: {
      category: "",
      type: "",
      unit: "",
      quantity: 0,
      image: "",
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
          const uniqueCategories = [
            ...new Set(data.map((item) => item.category)),
          ];

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
    if (addRawMaterialForm.watch("category")) {
      const selectedCategory = addRawMaterialForm.watch("category");
      const categoryData = rawMaterialTypes.find(
        (group) => group.category === selectedCategory
      );
      setFilteredRawMaterialTypes(categoryData ? categoryData.items : []);
    }
  }, [addRawMaterialForm.watch("category"), rawMaterialTypes]);

  useEffect(() => {
    if (addRawMaterialForm.watch("type")) {
      const selectedType = addRawMaterialForm.watch("type");
      const selectedItem = filteredRawMaterialTypes.find(
        (item) => item.rawMaterialType === selectedType
      );
      if (selectedItem) {
        setUnits([selectedItem.unit]);
      }
    }
  }, [addRawMaterialForm.watch("type"), filteredRawMaterialTypes]);

  const handleAddRawMaterial = async (values) => {
    if (!values.quantity || !values.type || !values.unit) {
      return toast.error("Please fill all fields");
    }

    if (!imageFileUrl) {
      return toast.error(
        "Please upload an image and wait for it to finish uploading."
      );
    }

    try {
      setAddRawMaterialLoading(true);

      const payload = {
        ...values,
        image: imageFileUrl,
      };

      const res = await axios.post(
        `${BASE_URL}/api/v1/raw-materials/new`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        setAddRawMaterialLoading(false);
        toast.success("Raw material added successfully");
        addRawMaterialForm.reset();
        onRawMaterialAdded(res.data.newRawMaterial);
        setIsDialogOpen(false);
      } else if (res.status === 200) {
        setAddRawMaterialLoading(false);
        toast.success("Raw material updated successfully");
        onRawMaterialAdded(res.data.rawMaterial);
        setIsDialogOpen(false);
      }
    } catch (error) {
      setAddRawMaterialLoading(false);
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    }
  };

  return (
    <Form {...addRawMaterialForm}>
      <form
        onSubmit={addRawMaterialForm.handleSubmit(handleAddRawMaterial)}
        className="space-y-4 w-full p-3"
      >
        <FormField
          control={addRawMaterialForm.control}
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
          control={addRawMaterialForm.control}
          name="type"
          render={({ field }) => (
            <SelectField
              field={field}
              label="Raw Material Type"
              options={filteredRawMaterialTypes.map(
                (item) => item.rawMaterialType
              )}
              placeholder="Select a raw material type"
            />
          )}
        />
        <FormField
          control={addRawMaterialForm.control}
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
          control={addRawMaterialForm.control}
          label="Quantity"
          name="quantity"
          placeholder="Quantity"
          type="number"
        />
        <ImageUpload
          onImageUpload={setImageFileUrl}
          defaultImageUrl={imageFileUrl}
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
              disabled={addRawMaterialLoading}
              className="flex items-center justify-center w-full"
            >
              {addRawMaterialLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 animate-spin" />
                  <span>Adding</span>
                </div>
              ) : (
                "Add Material"
              )}
            </Button>
          </AlertDialogFooter>
        </div>
      </form>
    </Form>
  );
};

AddNewRawMaterial.propTypes = {
  onRawMaterialAdded: PropTypes.func.isRequired,
  setIsDialogOpen: PropTypes.func.isRequired,
};

export default AddNewRawMaterial;
