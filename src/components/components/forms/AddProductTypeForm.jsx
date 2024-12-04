import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import CustomInput from "@/components/components/custom-components/CustomInput";
import { toast } from "sonner";
import * as z from "zod";
import axios from "axios";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import PropTypes from "prop-types";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import SelectField from "../custom-components/SelectField";
import { fetchSizes } from "@/hooks/helper";
import { Input } from "@/components/ui/input";

const addProductTypeSchema = z.object({
  level: z.string(),
  productType: z.string(),
  size: z.string(),
  rawMaterialsUsed: z
    .array(
      z.object({
        category: z.string(),
        type: z.string(),
        quantity: z.number(),
        unit: z.string(),
      })
    )
    .min(1, "At least one raw material is required"),
});

const AddProductTypeForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [rawMaterialTypes, setRawMaterialTypes] = useState([]);
  const [allSizes, setAllSizes] = useState([]);
  const [units, setUnits] = useState([]);

  const form = useForm({
    resolver: zodResolver(addProductTypeSchema),
    defaultValues: {
      productType: "",
      size: "",
      rawMaterialsUsed: [
        {
          category: "",
          type: "",
          quantity: 0,
          unit: "",
        },
      ],
    },
  });

  const {
    fields: rawMaterials,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "rawMaterialsUsed",
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

          // Remove duplicates from unit options for all raw materials
          const uniqueUnits = [...new Set(data.map((item) => item.unit))];

          setRawMaterialTypes(groupedArray);
          setUnits(uniqueUnits); // Set the unique units here
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRawMaterialTypes();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sizesData = await fetchSizes();
        setAllSizes(sizesData); // Store all sizes fetched
      } catch (error) {
        console.error("Failed to load sizes:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/system-maintenance/product-type/create`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 201) {
        setLoading(false);
        toast.success("Product Type added successfully!");
        form.reset();
        onSuccess(res.data.newProductType);
        onClose();
      }
    } catch (error) {
      console.error("Failed to add product type:", error);
      toast.error("Failed to add product type.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-4 max-w-lg"
      >
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <SelectField
              field={field}
              label="Level"
              options={["SHS", "COLLEGE"]}
              placeholder="Select a level"
            />
          )}
        />
        <CustomInput
          form={form}
          name="productType"
          label="Product Type"
          placeholder="e.g., POLO, SKIRT, PANTS"
          type="text"
        />
        <FormField
          control={form.control}
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
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Raw Materials Used</h3>
          {rawMaterials.map((item, index) => (
            <div
              key={item.id}
              className="border p-4 rounded-md space-y-2 relative"
            >
              <FormField
                control={form.control}
                name={`rawMaterialsUsed.${index}.category`}
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
                control={form.control}
                name={`rawMaterialsUsed.${index}.type`}
                render={({ field }) => (
                  <SelectField
                    field={field}
                    label="Raw Material Type"
                    options={rawMaterialTypes.flatMap((item) =>
                      item.items.map((i) => i.rawMaterialType)
                    )}
                    placeholder="Select a raw material type"
                  />
                )}
              />
              <FormField
                control={form.control}
                name={`rawMaterialsUsed.${index}.unit`}
                render={({ field }) => (
                  <SelectField
                    field={field}
                    label="Unit"
                    options={units}
                    placeholder="Select a unit"
                  />
                )}
              />
              <FormField
                control={form.control}
                name={`rawMaterialsUsed[${index}].quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Quantity"
                        type="number"
                        step="any"
                        min="0"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        className="w-full mt-2"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                variant="destructive"
                className="absolute -top-[1.5px] right-3 h-15 w-15"
                onClick={() => remove(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                category: "",
                type: "",
                quantity: 0,
                unit: "",
              })
            }
          >
            Add Raw Material
          </Button>
        </div>
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
  );
};

AddProductTypeForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default AddProductTypeForm;
