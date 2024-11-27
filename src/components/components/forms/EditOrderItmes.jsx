import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "antd";
import { toast } from "sonner";
import { Loader2, MinusCircle, PlusCircle } from "lucide-react";
import axios from "axios";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import SelectField from "../custom-components/SelectField";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import ToasterError from "@/lib/Toaster";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchProductTypes, fetchSizes } from "@/hooks/helper";

const EditOrderItems = ({ selectedOrder, setIsDialogOpen, onOrderUpdated }) => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [finishedProducts, setFinishedProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [allSizes, setAllSizes] = useState([]);

  const form = useForm({
    defaultValues: {
      orderItems: selectedOrder.orderItems
        .filter(
          (item) =>
            item.productType !== "LOGO" && item.productType !== "NECKTIE"
        )
        .map((item) => ({
          level: item.level || "",
          productType: item.productType || "",
          size: item.size || "",
          unitPrice: item.unitPrice || 0,
          quantity: item.quantity || 1,
        })),
    },
  });

  useEffect(() => {
    const fetchFinishedProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/finished-product/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setFinishedProducts(res.data.finishedProducts);
      } catch (error) {
        console.error("Error fetching finished products:", error);
      }
    };

    fetchFinishedProducts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productTypesData = await fetchProductTypes();
        setProductTypes(productTypesData);

        const sizesData = await fetchSizes();
        setAllSizes(sizesData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    fetchData();
  }, []);

  const priceMap = {
    SHS: {
      BLOUSE: { S14: 460, S15: 510, S16: 560, S17: 610, "S18+": 660 },
      SKIRT: { S24: 427, S25: 477, S26: 527, S27: 577, "S28+": 627 },
      POLO: { S15: 390, S16: 440, S17: 490, S18: 540, "S19+": 590 },
      PANTS: { S24: 450, S25: 500, S26: 550, S27: 600, "S28+": 650 },
      JPANTS: {
        "S33+34": 328.5,
        S35: 351,
        S36: 396,
        S37: 441,
        "S38+40": 531,
        "S42+45": 581,
      },
      "PE TSHIRT": {
        "2XL": 315,
        "XS/S": 337.5,
        "M/L": 382.5,
        XL: 427.5,
        XXL: 472.5,
      },
    },
    COLLEGE: {
      BLOUSE: { S14: 400, S15: 450, S16: 500, S17: 550, "S18+": 600 },
      SKIRT: { S24: 350, S25: 400, S26: 450, S27: 500, "S28+": 550 },
      POLO: { S15: 390, S16: 440, S17: 490, S18: 540, "S19+": 590 },
      PANTS: { S24: 450, S25: 500, S26: 550, S27: 600, "S28+": 650 },
      JPANTS: {
        "S33+34": 328.5,
        S35: 351,
        S36: 396,
        S37: 441,
        "S38+40": 531,
        "S42+45": 581,
      },
      "PE TSHIRT": {
        "2XL": 315,
        "XS/S": 337.5,
        "M/L": 382.5,
        XL: 427.5,
        XXL: 472.5,
      },
    },
  };

  const updateUnitPrice = (fieldName, productType, size, level) => {
    const unitPrice = priceMap[level]?.[productType]?.[size] || 0;
    form.setValue(`orderItems[${fieldName}].unitPrice`, unitPrice);
  };

  const { watch } = form;
  const orderItems = watch("orderItems");
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "orderItems",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      const total = values.orderItems.reduce((acc, curr) => {
        const unitPrice = curr.unitPrice || 0;
        const quantity = curr.quantity || 0;
        return acc + unitPrice * quantity;
      }, 0);
      setTotalPrice(total);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleUpdateItems = async (values) => {
    setLoadingUpdate(true);

    const orderItems = Array.isArray(values.orderItems)
      ? values.orderItems
      : [];

    // Validation checks
    if (orderItems.length === 0) {
      toast.error("No items to update", {
        description: "Please add items to update the order.",
      });
      setLoadingUpdate(false);
      return;
    }

    if (orderItems.some((item) => item.quantity === 0)) {
      toast.error("Invalid quantity", {
        description: "Quantity must be greater than 0.",
      });
      setLoadingUpdate(false);
      return;
    }

    if (
      !orderItems.some((item) => item.productType && item.size && item.level)
    ) {
      toast.error("Missing input", {
        description: "Please fill in all the fields.",
      });
      setLoadingUpdate(false);
      return;
    }

    // Add additional items based on productType
    const updatedOrderItems = orderItems.flatMap((item) => {
      const newItems = [item]; // Start with the original item

      if (item.productType === "POLO") {
        newItems.push({
          level: "",
          size: "",
          quantity: item.quantity,
          productType: "LOGO",
          unitPrice: 100,
          totalPrice: 100 * item.quantity,
        });
      } else if (item.productType === "BLOUSE") {
        newItems.push({
          level: "",
          size: "",
          quantity: 1,
          productType: "NECKTIE",
          unitPrice: 200,
          totalPrice: 200,
        });
      }

      return newItems;
    });

    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/order/edit-items/${selectedOrder._id}`,
        { orderItems: updatedOrderItems },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Order items updated successfully!");
        onOrderUpdated(response.data.orderStudent);
        setIsDialogOpen(false);
      } else {
        toast.error("Failed to update order items.");
      }
    } catch (error) {
      ToasterError({
        description: "Failed to update order items. Please try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  const onSubmit = async (values) => {
    await handleUpdateItems(values);
    form.reset();
  };

  const OrderItemForm = ({ index, form, updateUnitPrice, remove }) => {
    const { watch, getValues } = form;
    const level = watch(`orderItems[${index}].level`);
    const productType = watch(`orderItems[${index}].productType`);
    const size = watch(`orderItems[${index}].size`);

    useEffect(() => {
      updateUnitPrice(index, productType, size, level);
    }, [level, productType, size, index, updateUnitPrice]);

    const filteredSizes = allSizes.filter((sizeObj) => {
      if (productType === "POLO" || productType === "BLOUSE") {
        return ["S14", "S15", "S16", "S17", "S18", "S18+", "S19+"].includes(
          sizeObj.size
        );
      } else if (productType === "SKIRT" || productType === "PANTS") {
        return ["S24", "S25", "S26", "S27", "S28+"].includes(sizeObj.size);
      } else if (productType === "JPANTS") {
        return ["S33+34", "S35", "S36", "S37", "S38+40", "S42+45"].includes(
          sizeObj.size
        );
      } else if (productType === "PE TSHIRT") {
        return ["2XL", "XS/S", "M/L", "XL", "XXL"].includes(sizeObj.size);
      }
      return false;
    });

    return (
      <>
        <div
          key={index}
          className="flex gap-6 w-full justify-between items-center"
        >
          {/* Form Fields Container */}
          <div className="flex flex-col gap-4 w-full">
            {/* First Row: Level and Product Type */}
            <div className="flex gap-4 items-center w-full">
              <Controller
                control={form.control}
                name={`orderItems[${index}].level`}
                rules={{ required: "Missing level" }}
                render={({ field }) => (
                  <SelectField
                    field={field}
                    options={["SHS", "COLLEGE"]}
                    placeholder="Level"
                    onValueChange={(value) => {
                      const { productType, size } = getValues([
                        `orderItems[${index}].productType`,
                        `orderItems[${index}].size`,
                      ]);
                      updateUnitPrice(index, productType, size, value);
                    }}
                    className="w-full"
                    type="disabled"
                  />
                )}
              />
              <Controller
                control={form.control}
                name={`orderItems[${index}].productType`}
                rules={{ required: "Missing product type" }}
                render={({ field }) => (
                  <SelectField
                    field={field}
                    options={productTypes.map((type) => type.productType)}
                    placeholder="Type"
                    onValueChange={(value) => {
                      const { level, size } = getValues([
                        `orderItems[${index}].level`,
                        `orderItems[${index}].size`,
                      ]);
                      updateUnitPrice(index, value, size, level);
                      // Reset size when product type changes
                      form.setValue(`orderItems[${index}].size`, "");
                    }}
                    className="w-full"
                  />
                )}
              />
            </div>

            {/* Second Row: Size and Unit Price */}
            <div className="flex gap-4 items-center w-full">
              <Controller
                control={form.control}
                name={`orderItems[${index}].size`}
                render={({ field }) => (
                  <SelectField
                    field={field}
                    options={filteredSizes.map((sizeObj) => sizeObj.size)}
                    placeholder="Size"
                    onValueChange={(value) => {
                      const { productType, level } = getValues([
                        `orderItems[${index}].productType`,
                        `orderItems[${index}].level`,
                      ]);
                      updateUnitPrice(index, productType, value, level);
                    }}
                    className="w-full"
                  />
                )}
              />
              <FormField
                control={form.control}
                name={`orderItems[${index}].unitPrice`}
                render={({ field }) => (
                  <FormItem className="w-40">
                    <FormControl>
                      <Tooltip
                        title="Unit Price"
                        className="cursor-pointer w-full"
                      >
                        <Input
                          {...field}
                          placeholder="Unit Price"
                          type="number"
                          readOnly
                          className="w-full mt-2"
                        />
                      </Tooltip>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`orderItems[${index}].quantity`}
                rules={{ required: "Missing quantity" }}
                render={({ field }) => (
                  <FormItem className="w-40">
                    <FormControl>
                      <Tooltip
                        title="Quantity"
                        className="cursor-pointer w-full"
                      >
                        <Input
                          {...field}
                          placeholder="Quantity"
                          type="number"
                          className="w-full mt-2"
                        />
                      </Tooltip>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Remove Button */}
          <div className="flex items-center">
            <Tooltip title="Remove field">
              <MinusCircle
                onClick={() => remove(index)}
                style={{ width: "25px", height: "25px" }}
                className="cursor-pointer text-red-500"
              />
            </Tooltip>
          </div>
        </div>
        <Separator />
      </>
    );
  };

  OrderItemForm.propTypes = {
    index: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    updateUnitPrice: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full overflow-auto"
      >
        {fields.map((field, index) => (
          <OrderItemForm
            key={field.id}
            index={index}
            form={form}
            updateUnitPrice={updateUnitPrice}
            remove={remove}
          />
        ))}
        <Tooltip title="Add fields">
          <PlusCircle
            onClick={() =>
              append({
                level: selectedOrder.level,
                productType: "",
                size: "",
                unitPrice: 0,
                quantity: 1,
              })
            }
            className="mt-5 w-full cursor-pointer"
          />
        </Tooltip>
        <Separator className="my-8" />
        <h2 className="text-2xl font-bold mb-4">
          Selected Order Items Preview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orderItems
            .filter(
              (item) =>
                item.productType !== "LOGO" && item.productType !== "NECKTIE"
            )
            .map((item, index) => {
              const availableProduct = finishedProducts.find(
                (product) =>
                  product.level === item.level &&
                  product.productType === item.productType &&
                  product.size === item.size
              );

              return (
                <Card key={index}>
                  <CardContent>
                    <CardHeader className="text-lg font-bold">
                      <CardTitle>{item.productType}</CardTitle>
                    </CardHeader>
                    <CardDescription>
                      <p className="text-sm mb-1">Level: {item.level}</p>
                      <p className="text-sm mb-1">Size: {item.size}</p>
                      <p className="text-sm mb-1">Quantity: {item.quantity}</p>
                      {availableProduct && (
                        <p
                          className={`text-sm font-medium ${
                            availableProduct.status === "Low Stock"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          Status: {availableProduct.status} (Available:{" "}
                          {availableProduct.quantity})
                        </p>
                      )}
                      {!availableProduct && (
                        <p className="text-sm font-medium text-red-600">
                          Status: Not available in stock
                        </p>
                      )}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        <Separator className="my-8" />
        {/* Total Price Preview */}
        <div className="flex justify-between items-center">
          <span className="text-lg">Total Price:</span>
          <span className="text-lg font-bold ">
            {totalPrice.toLocaleString("en-PH", {
              style: "currency",
              currency: "PHP",
            })}
          </span>
        </div>
        <div className="flex flex-col items-center gap-4 mt-4">
          <AlertDialogFooter className="flex flex-col items-center mt-5 gap-4 w-full">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button type="submit" className="w-full">
              {loadingUpdate ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Items...
                </div>
              ) : (
                "Update Items"
              )}
            </Button>
          </AlertDialogFooter>
        </div>
      </form>
    </Form>
  );
};

EditOrderItems.propTypes = {
  selectedOrder: PropTypes.object.isRequired,
  setIsDialogOpen: PropTypes.func.isRequired,
  onOrderUpdated: PropTypes.func.isRequired,
};

export default EditOrderItems;
