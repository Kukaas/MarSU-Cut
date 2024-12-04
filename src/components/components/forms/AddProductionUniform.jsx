// UI
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
import { cn } from "@/lib/utils";
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

const AddProductionUniform = ({ onProductionAdded, setIsOpen }) => {
  const [addProductionLoading, setAddProductionLoading] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [filteredRawMaterials, setFilteredRawMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize formState from localStorage or with default values
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

  // Initialize the form with default values from formState or localStorage
  const productionForm = useForm({
    resolver: zodResolver(AddProductionSchema),
    defaultValues: formState,
  });

  // Sync formState with form values and save to localStorage
  useEffect(() => {
    const subscription = productionForm.watch((values) => {
      setFormState(values);
      localStorage.setItem("formState", JSON.stringify(values));
    });

    return () => subscription.unsubscribe();
  }, [productionForm]);

  const { level, productType, size } = productionForm.watch();

  // Fetch product types from the API
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
        setProductTypes(res.data.productTypes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product types:", error);
        setLoading(false);
      }
    };

    fetchProductTypes();
  }, []);

  // Filter raw materials based on level, productType, and size
  useEffect(() => {
    if (level && productType && size) {
      const matchedProduct = productTypes.find(
        (item) =>
          item.level === level &&
          item.productType === productType &&
          item.size === size
      );
      setFilteredRawMaterials(
        matchedProduct ? matchedProduct.rawMaterialsUsed : []
      );
    } else {
      setFilteredRawMaterials([]);
    }
  }, [level, productType, size, productTypes]);

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

      // Get raw materials used from the filtered raw materials
      const rawMaterialsUsed = filteredRawMaterials.map((material) => ({
        type: material.type,
        quantity: material.quantity * values.quantity, // Multiply by the production quantity
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
            {/* Production Details */}
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
                        options={[
                          ...new Set(
                            productTypes.map((item) => item.productType)
                          ),
                        ]}
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
                      options={[
                        ...new Set(
                          productTypes
                            .filter((item) => item.productType === productType)
                            .map((item) => item.size)
                        ),
                      ]}
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
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Production From</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal w-full",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "MMMM dd, YYY")
                              ) : (
                                <span>From</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={productionForm.control}
                  name="productionDateTo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Production To</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal w-full",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "MMMM dd, YYY")
                              ) : (
                                <span>To</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={productionForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value !== undefined ? field.value : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value !== "" ? parseFloat(value) : ""); // Ensure the value is parsed as float
                        }}
                        placeholder="Quantity"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            {/* Raw Materials */}
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

            <div className="flex flex-col items-center gap-4 mt-4">
              <AlertDialogFooter className="w-full flex flex-col items-center gap-4">
                <Button
                  onClick={handleButtonClick}
                  type="button"
                  disabled={addProductionLoading}
                  className="w-full flex items-center justify-center"
                >
                  {addProductionLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 animate-spin" />
                      <span>Adding</span>
                    </div>
                  ) : (
                    "Add Production"
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

AddProductionUniform.propTypes = {
  onProductionAdded: PropTypes.func,
  setIsOpen: PropTypes.func,
};

export default AddProductionUniform;
