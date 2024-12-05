import PropTypes from "prop-types";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { CalendarIcon, Loader2, MinusCircle, PlusCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import SelectField from "../custom-components/SelectField";
import axios from "axios";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import CustomInput from "../custom-components/CustomInput";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const getStockStatus = (quantity) => {
  if (quantity > 10) return { status: "In Stock", color: "text-green-500" };
  if (quantity > 0) return { status: "Low Stock", color: "text-orange-500" };
  return { status: "Out of Stock", color: "text-red-500" };
};

const CreateOtherProduction = ({ onOtherProductionAdded, setIsDialogOpen }) => {
  const [addProductionLoading, setAddProductionLoading] = useState(false);
  const [inventory, setInventory] = useState([]);

  const productionForm = useForm({
    defaultValues: {
      rawMaterialsUsed: [{ type: "", quantity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: productionForm.control,
    name: "rawMaterialsUsed",
  });

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/raw-materials/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setInventory(res.data.rawMaterials);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to fetch inventory data");
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddRawMaterial = useCallback(() => {
    append({ type: "", quantity: 0 });
  }, [append]);

  const handleRemoveRawMaterial = useCallback(
    (index) => {
      remove(index);
    },
    [remove]
  );

  const handleRawMaterialTypeChange = (index, value) => {
    const currentMaterials = productionForm.getValues().rawMaterialsUsed;
    currentMaterials[index] = {
      ...currentMaterials[index],
      type: value,
    };
    productionForm.setValue("rawMaterialsUsed", currentMaterials);
    productionForm.trigger(`rawMaterialsUsed.${index}.quantity`);
  };

  const handleAddProduction = async (values) => {
    if (!values.quantity || values.quantity <= 0) {
      return toast.error("Please enter a valid product quantity.");
    }

    if (
      values.rawMaterialsUsed.some(
        (material) => !material.type || !material.quantity
      )
    ) {
      return toast.error("Please fill in all raw material fields.");
    }

    try {
      setAddProductionLoading(true);

      // Multiply raw material quantities by the product quantity
      const rawMaterialsUsed = values.rawMaterialsUsed.map((material) => ({
        type: material.type,
        quantity: parseFloat(material.quantity) * parseFloat(values.quantity),
      }));

      // Prepare production data payload
      const productionData = { ...values, rawMaterialsUsed };

      // Send the request
      const res = await axios.post(
        `${BASE_URL}/api/v1/production/other/create`,
        productionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Handle successful response
      if (res.status === 201) {
        toast.success("Production added successfully");
        onOtherProductionAdded(res.data.production);
        setIsDialogOpen(false);
        productionForm.reset();
      }
    } catch (error) {
      setAddProductionLoading(false);
      toast.error("Failed to add production. Please try again.");
    }
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
              <div className="w-full">
                <CustomInput
                  form={productionForm}
                  name="productType"
                  label="Product Type"
                  placeholder="Product Type"
                  type="text"
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
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>

            <fieldset className="border border-gray-300 rounded-md p-4 mt-4">
              <legend className="text-lg font-semibold">
                Raw Materials Used
              </legend>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-center mb-4">
                  <FormField
                    control={productionForm.control}
                    name={`rawMaterialsUsed.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material Type</FormLabel>
                        <SelectField
                          field={{
                            ...field,
                            value: field.value,
                            onChange: (value) =>
                              handleRawMaterialTypeChange(index, value),
                          }}
                          placeholder="Select Raw Material"
                          options={inventory.map((item) => item.type)}
                          className="w-full"
                        />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={productionForm.control}
                    name={`rawMaterialsUsed.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Quantity:
                          {fields[index].type && (
                            <span className="ml-2 text-sm">
                              {(() => {
                                const selectedMaterial = inventory.find(
                                  (item) => item.type === fields[index].type
                                );
                                if (selectedMaterial) {
                                  const { color } = getStockStatus(
                                    selectedMaterial.quantity
                                  );
                                  return (
                                    <span className={color}>
                                      {`(${selectedMaterial.quantity})`}
                                    </span>
                                  );
                                }
                                return "(N/A)";
                              })()}
                            </span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            {...field}
                            placeholder="Quantity"
                            className="w-full"
                            max={
                              inventory.find(
                                (item) => item.type === fields[index].type
                              )?.quantity || Infinity
                            }
                            onChange={(e) => {
                              const maxQuantity =
                                inventory.find(
                                  (item) => item.type === fields[index].type
                                )?.quantity || Infinity;
                              const value = Math.min(
                                parseInt(e.target.value),
                                maxQuantity
                              );
                              field.onChange(value);

                              field.onChange(parseFloat(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="icon"
                    onClick={() => handleRemoveRawMaterial(index)}
                    className="text-red-500 mt-10"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </Button>
                </div>
              ))}
              <div className="flex justify-center mt-4">
                <Button
                  type="button"
                  onClick={handleAddRawMaterial}
                  variant="icon"
                >
                  <PlusCircle className="w-5 h-5" />
                </Button>
              </div>
            </fieldset>

            <div className="flex justify-center mt-6">
              <Button
                type="submit"
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
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

CreateOtherProduction.propTypes = {
  onOtherProductionAdded: PropTypes.func,
  setIsDialogOpen: PropTypes.func,
};

export default CreateOtherProduction;
