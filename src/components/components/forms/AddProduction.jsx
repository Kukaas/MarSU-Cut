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
import { Tooltip } from "antd";

// icons
import { CalendarIcon, Loader2, MinusCircle, PlusCircle } from "lucide-react";

// others
import ToasterError from "@/lib/Toaster";
import { cn } from "@/lib/utils";
import { AddProductionSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import SelectField from "../custom-components/SelectField";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import CustomNumberInput from "../custom-components/CustomNumberInput";

const AddProduction = ({ onProductionAdded, setIsOpen }) => {
  const [addProductionLoading, setAddProductionLoading] = useState(false);
  const [rawMaterials, setRawMaterials] = useState([]);
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
    defaultValues: formState, // Set default values from formState
  });

  // Sync formState with form values and save to localStorage
  useEffect(() => {
    const subscription = productionForm.watch((values) => {
      setFormState(values); // Update formState
      localStorage.setItem("formState", JSON.stringify(values)); // Persist formState in localStorage
    });

    return () => subscription.unsubscribe();
  }, [productionForm]);

  const productType = productionForm.watch("productType");
  const sizes =
    productType === "POLO" || productType === "BLOUSE"
      ? ["S14", "S15", "S16", "S17", "S18", "S18+", "S19+"]
      : productType === "SKIRT" || productType === "PANTS"
      ? ["S24", "S25", "S26", "S27", "S28+"]
      : productType === "JPANTS"
      ? ["S33+34", "S35", "S36", "S37", "S38+40", "S42+45"]
      : productType === "PE TSHIRT"
      ? ["2XL", "XS/S", "M/L", "XL", "XXL"]
      : productType === "ACADEMIC GOWN"
      ? ["Small", "Medium", "Large", "Extra Large"]
      : [];

  const { fields, append, remove } = useFieldArray({
    control: productionForm.control,
    name: "rawMaterialsUsed",
  });

  const handleAddProduction = async (values) => {
    if (values.productionDateFrom > values.productionDateTo) {
      return toast.error(
        "Production date from cannot be greater than production date to"
      );
    }

    if (!values.rawMaterialsUsed.length) {
      return toast.error("Please add raw materials used");
    }

    if (!values.level || !values.productType || !values.size) {
      return toast.error("Please fill all fields");
    }

    if (values.quantity === 0) {
      return toast.error("Quantity must not be 0");
    }

    // Check if any raw material's quantity is 0
    const hasZeroQuantity = values.rawMaterialsUsed.some(
      (rawMaterial) => rawMaterial.quantity === 0
    );

    if (hasZeroQuantity) {
      return toast.error("Raw material quantity must not be 0");
    }

    try {
      setAddProductionLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/production/create`,
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
    }
  };

  const handleButtonClick = () => {
    const values = productionForm.getValues();
    handleAddProduction(values);
  };

  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/raw-materials/all `, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (res.status === 200) {
          setRawMaterials(res.data.rawMaterials);
        }
      } catch (error) {
        ToasterError({
          description: "Please check your internet connection and try again.",
        });
      }
    };

    fetchRawMaterials();
  }, []);

  const rawMaterialsSelectOptions = rawMaterials
    .filter((rawMaterial) => rawMaterial.quantity > 0)
    .map((rawMaterial) => ({
      label: rawMaterial.type,
      value: rawMaterial.type,
    }));

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
                  render={({ field }) => (
                    <SelectField
                      field={field}
                      label="Product Type"
                      options={[
                        "SKIRT",
                        "POLO",
                        "PANTS",
                        "BLOUSE",
                        "PE TSHIRT",
                        "JPANTS",
                        "ACADEMIC GOWN",
                      ]}
                      placeholder="Type"
                    />
                  )}
                />

                <FormField
                  control={productionForm.control}
                  name="size"
                  render={({ field }) => (
                    <SelectField
                      field={field}
                      label="Size"
                      options={sizes}
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
                                format(new Date(field.value), "MMMM dd")
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
                                format(new Date(field.value), "MMMM dd")
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
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CustomNumberInput
                control={productionForm.control}
                label="Quantity"
                name="quantity"
                placeholder="Quantity"
                type="number"
              />
            </fieldset>

            {/* Raw Materials Used */}
            <fieldset className="border border-gray-300 rounded-md p-4 mt-2 w-full">
              <legend className="text-lg font-semibold">
                Raw Materials Used
              </legend>
              <div className="space-y-4 mt-2 w-full">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center space-x-4 justify-between w-full"
                  >
                    <SelectField
                      field={{
                        value: productionForm.watch(
                          `rawMaterialsUsed.${index}.type`
                        ),
                        onChange: (value) => {
                          productionForm.setValue(
                            `rawMaterialsUsed.${index}.type`,
                            value
                          );
                        },
                      }}
                      label="Raw Material"
                      options={rawMaterialsSelectOptions.map(
                        (option) => option.value
                      )}
                      placeholder="Select Material"
                      onValueChange={(value) => {
                        productionForm.setValue(
                          `rawMaterialsUsed.${index}.type`,
                          value
                        );
                      }}
                      name={`rawMaterialsUsed.${index}.quantity`}
                    />
                    <FormField
                      control={productionForm.control}
                      name={`rawMaterialsUsed.${index}.quantity`}
                      render={({ field }) => {
                        const selectedRawMaterialType = productionForm.watch(
                          `rawMaterialsUsed.${index}.type`
                        );

                        // Find the selected raw material to get the available quantity
                        const selectedRawMaterial = rawMaterials.find(
                          (rawMaterial) =>
                            rawMaterial.type === selectedRawMaterialType
                        );

                        const availableQuantity = selectedRawMaterial
                          ? selectedRawMaterial.quantity
                          : 0;

                        return (
                          <FormItem>
                            <FormLabel>
                              Available: {availableQuantity}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={
                                  field.value !== undefined ? field.value : ""
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const parsedValue =
                                    value !== "" ? parseFloat(value) : "";

                                  // Ensure quantity doesn't exceed available stock
                                  field.onChange(
                                    parsedValue > availableQuantity
                                      ? availableQuantity
                                      : parsedValue >= 0
                                      ? parsedValue
                                      : 0
                                  );
                                }}
                                placeholder="Quantity"
                                className="w-[100px]"
                                min={0}
                                max={availableQuantity}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <Tooltip title="Remove input">
                      <MinusCircle
                        size={20}
                        onClick={() => remove(index)}
                        className="mt-8"
                      />
                    </Tooltip>
                  </div>
                ))}
                <div className="flex justify-center mt-3">
                  <Tooltip title="Add new input">
                    <PlusCircle
                      size={20}
                      onClick={() => append({ type: "", quantity: 0 })}
                      className="flex items-center justify-center mt-2"
                    />
                  </Tooltip>
                </div>
              </div>
            </fieldset>
            <div className="flex flex-col items-center gap-4 mt-4">
              <AlertDialogFooter className="w-full flex flex-col items-center gap-4">
                <AlertDialogCancel asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      localStorage.removeItem("formState");
                    }}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </AlertDialogCancel>

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

AddProduction.propTypes = {
  onProductionAdded: PropTypes.func,
  setIsOpen: PropTypes.func,
};

export default AddProduction;
