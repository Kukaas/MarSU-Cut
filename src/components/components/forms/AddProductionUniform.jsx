import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// icons
import { CalendarIcon, Loader2 } from "lucide-react";

// others
import ToasterError from "@/lib/Toaster";
import { AddProductionSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import SelectField from "../custom-components/SelectField";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { fetchSizes } from "@/hooks/helper";

const AddProductionUniform = ({ onProductionAdded, setIsOpen }) => {
  const [addProductionLoading, setAddProductionLoading] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [filteredRawMaterials, setRawMaterialsForSelectedType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allSizes, setAllSizes] = useState([]);
  const [filteredSizes, setFilteredSizes] = useState([]);

  const initialFormState = JSON.parse(localStorage.getItem("formState")) || {
    productType: "",
    size: "",
    level: "",
    productionDateFrom: "",
    productionDateTo: "",
    quantity: 0,
    rawMaterialsUsed: [{ type: "", quantity: 0 }],
  };

  const [formState, setFormState] = useState(initialFormState);

  const productionForm = useForm({
    resolver: zodResolver(AddProductionSchema),
    defaultValues: formState,
  });

  useEffect(() => {
    const subscription = productionForm.watch((values) => {
      setFormState(values);
      localStorage.setItem("formState", JSON.stringify(values));
    });

    return () => subscription.unsubscribe();
  }, [productionForm]);

  // Define the mapping for product types to sizes
  const productTypeToSizes = {
    POLO: ["S14", "S15", "S16", "S17", "S18", "S18+", "S19+"],
    BLOUSE: ["S14", "S15", "S16", "S17", "S18", "S18+", "S19+"],
    SKIRT: ["S24", "S25", "S26", "S27", "S28+"],
    PANTS: ["S24", "S25", "S26", "S27", "S28+"],
    JPANTS: ["S33+34", "S35", "S36", "S37", "S38+40", "S42+45"],
    "PE TSHIRT": ["2XL", "XS/S", "M/L", "XL", "XXL"],
  };

  const { level, productType, size } = productionForm.watch();

  useEffect(() => {
    const fetchProductTypes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/system-maintenance/product-type/all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        // Assuming product types are under "productTypes" key
        const uniqueProductTypes = Array.from(
          new Set(res.data.productTypes.map((a) => a.productType))
        ).map((productType) => {
          return {
            productType,
          };
        });

        // Filter out unwanted types
        const filteredProductTypes = uniqueProductTypes.filter(
          (item) =>
            item.productType !== "TOGA" &&
            item.productType !== "CAP" &&
            item.productType !== "HOOD"
        );

        setProductTypes(filteredProductTypes);
      } catch (error) {
        console.error("Error fetching product types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductTypes();
  }, []);

  // Fetch sizes for all product types on mount
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

  // Filter sizes based on the selected product type
  useEffect(() => {
    if (productType && productTypeToSizes[productType]) {
      const predefinedSizes = productTypeToSizes[productType];
      const matchedSizes = allSizes.filter((size) =>
        predefinedSizes.includes(size.size)
      );
      setFilteredSizes(matchedSizes.map((size) => size.size)); // Map matched sizes
    } else {
      setFilteredSizes([]); // Clear sizes if no match
    }
  }, [productType, allSizes]);

  useEffect(() => {
    const fetchRawMaterialsForSelected = async () => {
      if (productType && formState.level && filteredSizes.length) {
        try {
          // Fetch the product type data using the selected level, type, and size
          const res = await axios.get(
            `${BASE_URL}/api/v1/system-maintenance/product-type/all`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );

          // Filter product types by matching level, productType, and size
          const productData = res.data.productTypes.filter(
            (item) =>
              item.productType === productType &&
              item.level === formState.level &&
              item.size === formState.size
          );

          if (productData.length > 0) {
            // Set raw materials based on the filtered product data
            setRawMaterialsForSelectedType(productData[0].rawMaterialsUsed);
          }
        } catch (error) {
          console.error("Error fetching raw materials:", error);
        }
      }
    };

    fetchRawMaterialsForSelected();
  }, [productType, formState.level, formState.size, filteredSizes]);

  const handleAddProduction = async (values) => {
    if (values.productionDateFrom > values.productionDateTo) {
      return toast.error(
        "Production date from cannot be greater than production date to"
      );
    }

    if (!values.level || !values.productType || !values.size) {
      return toast.error("Please select level, product type, and size");
    }

    try {
      setAddProductionLoading(true);

      const rawMaterialsUsed = filteredRawMaterials.map((material) => ({
        type: material.type,
        quantity: material.quantity * values.quantity,
      }));

      const productionData = { ...values, rawMaterialsUsed };

      const res = await axios.post(
        `${BASE_URL}/api/v1/production/create`,
        productionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        setAddProductionLoading(false);
        toast.success("Production added successfully");
        productionForm.reset();
        onProductionAdded(res.data.production);
        localStorage.removeItem("formState");
        setIsOpen(false);
      }
    } catch (error) {
      setAddProductionLoading(false);
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 404) {
        toast.error(error.response.data.message);
      }
    } finally {
      setAddProductionLoading(false);
    }
  };

  const handleButtonClick = () => {
    const values = productionForm.getValues();
    handleAddProduction(values);
  };

  return (
    <div className="grid gap-6 py-2">
      <div className="w-full">
        <Form {...productionForm}>
          <form onSubmit={productionForm.handleSubmit(handleAddProduction)}>
            <fieldset className="border border-gray-300 rounded-md p-4 space-y-3">
              <legend className="text-lg font-semibold">
                Production Details
              </legend>
              <div className="flex w-full justify-between gap-2">
                <FormField
                  control={productionForm.control}
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
                  control={productionForm.control}
                  name="productType"
                  render={({ field }) =>
                    loading ? (
                      <SelectField
                        field={field}
                        label="Product Type"
                        options={["Loading..."]}
                        placeholder="Type"
                      />
                    ) : (
                      <SelectField
                        field={field}
                        label="Product Type"
                        options={productTypes.map((type) => type.productType)}
                        placeholder="Type"
                      />
                    )
                  }
                />
                <FormField
                  control={productionForm.control}
                  name="size"
                  render={({ field }) => (
                    <SelectField
                      field={field}
                      label="Size"
                      options={filteredSizes}
                      placeholder="Size"
                    />
                  )}
                />
              </div>

              <div className="flex space-x-4 mt-4">
                <FormField
                  control={productionForm.control}
                  name="productionDateFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Production Date From</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {field.value
                              ? format(new Date(field.value), "PPP")
                              : "Select Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  control={productionForm.control}
                  name="productionDateTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Production Date To</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {field.value
                              ? format(new Date(field.value), "PPP")
                              : "Select Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormField
                  control={productionForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Quantity"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <fieldset className="border border-gray-300 rounded-md p-4 mt-4">
                <legend className="text-lg font-semibold">
                  Raw Materials Used
                </legend>
                {filteredRawMaterials.length > 0 ? (
                  <ul className="space-y-2">
                    {filteredRawMaterials.map((material) => (
                      <li
                        key={material._id}
                        className="flex justify-between items-center"
                      >
                        <span>
                          <strong>{material.type}</strong> ({material.category})
                        </span>
                        <span>
                          {material.quantity} {material.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    {level && productType && size
                      ? "No raw materials available for this selection."
                      : "Select level, product type, and size to see raw materials."}
                  </p>
                )}
              </fieldset>

              <div className="mt-6">
                <AlertDialogFooter>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={handleButtonClick}
                    disabled={addProductionLoading}
                  >
                    {addProductionLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Add Production"
                    )}
                  </Button>
                </AlertDialogFooter>
              </div>
            </fieldset>
          </form>
        </Form>
      </div>
    </div>
  );
};

AddProductionUniform.propTypes = {
  onProductionAdded: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default AddProductionUniform;
