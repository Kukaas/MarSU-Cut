/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip } from "antd";
import axios from "axios";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import PropTypes from "prop-types";

const AddOrderItems = ({ selectedOrder }) => {
  const [loadingAddItems, setLoadingAddItems] = useState(false);

  const toastError = () => {
    toast.error("Uh oh! Something went wrong.");
  };

  const form = useForm({
    defaultValues: {
      orderItems: [],
    },
  });

  // Function to automatically update the unit price based on productType, size, and level
  const updateUnitPrice = (fieldName, productType, size, level) => {
    // Example logic to determine unit price based on productType, size, and level
    let unitPrice = 0;
    if (productType === "BLOUSE" && size === "S14" && level === "SHS") {
      unitPrice = 460;
    } else if (productType === "BLOUSE" && size === "S15" && level === "SHS") {
      unitPrice = 510;
    } else if (productType === "BLOUSE" && size === "S16" && level === "SHS") {
      unitPrice = 560;
    } else if (productType === "BLOUSE" && size === "S17" && level === "SHS") {
      unitPrice = 610;
    } else if (productType === "BLOUSE" && size === "S18+" && level === "SHS") {
      unitPrice = 660;
    } else if (
      productType === "BLOUSE" &&
      size === "S14" &&
      level === "COLLEGE"
    ) {
      unitPrice = 400;
    } else if (
      productType === "BLOUSE" &&
      size === "S15" &&
      level === "COLLEGE"
    ) {
      unitPrice = 450;
    } else if (
      productType === "BLOUSE" &&
      size === "S16" &&
      level === "COLLEGE"
    ) {
      unitPrice = 500;
    } else if (
      productType === "BLOUSE" &&
      size === "S17" &&
      level === "COLLEGE"
    ) {
      unitPrice = 550;
    } else if (
      productType === "BLOUSE" &&
      size === "S18+" &&
      level === "COLLEGE"
    ) {
      unitPrice = 600;
    } else if (productType === "SKIRT" && size === "S24" && level === "SHS") {
      unitPrice = 427;
    } else if (productType === "SKIRT" && size === "S25" && level === "SHS") {
      unitPrice = 477;
    } else if (productType === "SKIRT" && size === "S26" && level === "SHS") {
      unitPrice = 527;
    } else if (productType === "SKIRT" && size === "S27" && level === "SHS") {
      unitPrice = 577;
    } else if (productType === "SKIRT" && size === "S28+" && level === "SHS") {
      unitPrice = 627;
    } else if (
      productType === "SKIRT" &&
      size === "S24" &&
      level === "COLLEGE"
    ) {
      unitPrice = 350;
    } else if (
      productType === "SKIRT" &&
      size === "S25" &&
      level === "COLLEGE"
    ) {
      unitPrice = 400;
    } else if (
      productType === "SKIRT" &&
      size === "S26" &&
      level === "COLLEGE"
    ) {
      unitPrice = 450;
    } else if (
      productType === "SKIRT" &&
      size === "S27" &&
      level === "COLLEGE"
    ) {
      unitPrice = 500;
    } else if (
      productType === "SKIRT" &&
      size === "S28+" &&
      level === "COLLEGE"
    ) {
      unitPrice = 550;
    } else if (productType === "POLO" && size === "S15" && level === "SHS") {
      unitPrice = 390;
    } else if (productType === "POLO" && size === "S16" && level === "SHS") {
      unitPrice = 440;
    } else if (productType === "POLO" && size === "S17" && level === "SHS") {
      unitPrice = 490;
    } else if (productType === "POLO" && size === "S18" && level === "SHS") {
      unitPrice = 540;
    } else if (productType === "POLO" && size === "S19+" && level === "SHS") {
      unitPrice = 590;
    } else if (
      productType === "POLO" &&
      size === "S15" &&
      level === "COLLEGE"
    ) {
      unitPrice = 390;
    } else if (
      productType === "POLO" &&
      size === "S16" &&
      level === "COLLEGE"
    ) {
      unitPrice = 440;
    } else if (
      productType === "POLO" &&
      size === "S17" &&
      level === "COLLEGE"
    ) {
      unitPrice = 490;
    } else if (
      productType === "POLO" &&
      size === "S18" &&
      level === "COLLEGE"
    ) {
      unitPrice = 540;
    } else if (
      productType === "POLO" &&
      size === "S19+" &&
      level === "COLLEGE"
    ) {
      unitPrice = 590;
    } else if (productType === "PANTS" && size === "S24" && level === "SHS") {
      unitPrice = 450;
    } else if (productType === "PANTS" && size === "S25" && level === "SHS") {
      unitPrice = 500;
    } else if (productType === "PANTS" && size === "S26" && level === "SHS") {
      unitPrice = 550;
    } else if (productType === "PANTS" && size === "S27" && level === "SHS") {
      unitPrice = 600;
    } else if (productType === "PANTS" && size === "S28+" && level === "SHS") {
      unitPrice = 650;
    } else if (
      productType === "PANTS" &&
      size === "S24" &&
      level === "COLLEGE"
    ) {
      unitPrice = 450;
    } else if (
      productType === "PANTS" &&
      size === "S25" &&
      level === "COLLEGE"
    ) {
      unitPrice = 500;
    } else if (
      productType === "PANTS" &&
      size === "S26" &&
      level === "COLLEGE"
    ) {
      unitPrice = 550;
    } else if (
      productType === "PANTS" &&
      size === "S27" &&
      level === "COLLEGE"
    ) {
      unitPrice = 600;
    } else if (
      productType === "PANTS" &&
      size === "S28+" &&
      level === "COLLEGE"
    ) {
      unitPrice = 650;
    } else if (
      productType === "JPANTS" &&
      size === "S33+34" &&
      level === "SHS"
    ) {
      unitPrice = 328.5;
    } else if (
      productType === "JPANTS" &&
      size === "S35" &&
      level === "SHS"
    ) {
      unitPrice = 351;
    } else if ( 
      productType === "JPANTS" &&
      size === "S36" &&
      level === "SHS"
    ) {
      unitPrice = 396;
    } else if (
      productType === "JPANTS" &&
      size === "S37" &&
      level === "SHS"
    ) {
      unitPrice = 441;
    } else if (
      productType === "JPANTS" &&
      size === "S38+40" &&
      level === "SHS"
    ) {
      unitPrice = 531;
    } else if (
      productType === "JPANTS" &&
      size === "S42+45" &&
      level === "SHS"
    ) {
      unitPrice = 581;
    } else if (
      productType === "JPANTS" &&
      size === "S33+34" &&
      level === "COLLEGE"
    ) {
      unitPrice = 328.5;
    } else if (
      productType === "JPANTS" &&
      size === "S35" &&
      level === "COLLEGE"
    ) {
      unitPrice = 351;
    } else if (
      productType === "JPANTS" &&
      size === "S36" &&
      level === "COLLEGE"
    ) {
      unitPrice = 396;
    } else if (
      productType === "JPANTS" &&
      size === "S37" &&
      level === "COLLEGE"
    ) {
      unitPrice = 441;
    } else if (
      productType === "JPANTS" &&
      size === "S38+40" &&
      level === "COLLEGE"
    ) {
      unitPrice = 531;
    } else if (
      productType === "JPANTS" &&
      size === "S42+45" &&
      level === "COLLEGE"
    ) {
      unitPrice = 581;
    } else if (
      productType === "PE TSHIRT" &&
      size === "2XL" &&
      level === "SHS"
    ) {
      unitPrice = 315;
    } else if (
      productType === "PE TSHIRT" &&
      size === "XS/S" &&
      level === "SHS"
    ) {
      unitPrice = 337.5;
    } else if (
      productType === "PE TSHIRT" &&
      size === "M/L" &&
      level === "SHS"
    ) {
      unitPrice = 382.5;
    } else if (
      productType === "PE TSHIRT" &&
      size === "XL" &&
      level === "SHS"
    ) {
      unitPrice = 427.5;
    } else if (
      productType === "PE TSHIRT" &&
      size === "XXL" &&
      level === "SHS"
    ) {
      unitPrice = 472.5;
    } else if (
      productType === "PE TSHIRT" &&
      size === "2XL" &&
      level === "COLLEGE"
    ) {
      unitPrice = 315;
    } else if (
      productType === "PE TSHIRT" &&
      size === "XS/S" &&
      level === "COLLEGE"
    ) {
      unitPrice = 337.5;
    } else if (
      productType === "PE TSHIRT" &&
      size === "M/L" &&
      level === "COLLEGE"
    ) {
      unitPrice = 382.5;
    } else if (
      productType === "PE TSHIRT" &&
      size === "XL" &&
      level === "COLLEGE"
    ) {
      unitPrice = 427.5;
    } else if (
      productType === "PE TSHIRT" &&
      size === "XXL" &&
      level === "COLLEGE"
    ) {
      unitPrice = 472.5;
    }
    // Add more conditions as needed...
    // Update the form field for unitPrice
    form.setValue(`orderItems[${fieldName}].unitPrice`, unitPrice);
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "orderItems",
  });

  const handleAddItems = async (values) => {
    setLoadingAddItems(true);
  
    // Ensure orderItems is an array
    const orderItems = Array.isArray(values.orderItems)
      ? values.orderItems
      : [];
  
    // Add additional items based on productType and update totalPrice
    const updatedOrderItems = orderItems.flatMap((item) => {
      const newItems = [item]; // Start with the original item
  
      if (item.productType === "POLO") {
        newItems.push({
          level: "",
          size: "",
          quantity: 1,
          productType: "LOGO",
          unitPrice: 100,
          totalPrice: 100,
        });
      } else if (item.productType === "BLOUSE") {
        newItems.push(
          {
            level: "",
            size: "",
            quantity: 1,
            productType: "NECKTIE",
            unitPrice: 200,
            totalPrice: 200,
          },
        );
      }
  
      return newItems;
    });
  
    const res = await axios.put(
      `https://marsu.cut.server.kukaas.tech/api/v1/order/add-item/${selectedOrder._id}`,
      {
        orderItems: updatedOrderItems,
      }
    );
  
    if (res.status === 200) {
      toast.success(`The student ${selectedOrder.studentName} is measured`, {
        action: {
          label: "Ok",
        },
      });
    } else {
      toastError();
    }
  
    setLoadingAddItems(false);
  };

  const onSubmit = async (values) => {
    await handleAddItems(values);
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

    return (
      <div key={index} className="flex gap-4 w-full items-center">
        <Controller
          control={form.control}
          name={`orderItems[${index}].level`}
          rules={{ required: "Missing level" }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-15 overflow-y-auto" variant="outline">
                      {field.value || "Level"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        const { productType, size } = getValues([
                          `orderItems[${index}].productType`,
                          `orderItems[${index}].size`,
                        ]);
                        updateUnitPrice(index, productType, size, "SHS");
                        field.onChange("SHS");
                      }}
                    >
                      SHS
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const { productType, size } = getValues([
                          `orderItems[${index}].productType`,
                          `orderItems[${index}].size`,
                        ]);
                        updateUnitPrice(index, productType, size, "COLLEGE");
                        field.onChange("COLLEGE");
                      }}
                    >
                      COLLEGE
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          control={form.control}
          name={`orderItems[${index}].productType`}
          rules={{ required: "Missing product type" }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-15 overflow-y-auto" variant="outline">
                      {field.value || "Type"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[
                      "SKIRT",
                      "POLO",
                      "PANTS",
                      "BLOUSE",
                      "PE TSHIRT",
                      "JPANTS",
                    ].map((type) => (
                      <DropdownMenuItem
                        key={type}
                        onClick={() => {
                          const { level, size } = getValues([
                            `orderItems[${index}].level`,
                            `orderItems[${index}].size`,
                          ]);
                          updateUnitPrice(index, type, size, level);
                          field.onChange(type);
                        }}
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          control={form.control}
          name={`orderItems[${index}].size`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-15 overflow-y-auto" variant="outline">
                      {field.value || "Size"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-48 overflow-y-auto">
                    {[
                      "S14",
                      "S15",
                      "S16",
                      "S17",
                      "S18",
                      "S18+",
                      "S19+",
                      "S24",
                      "S25",
                      "S26",
                      "S27",
                      "S28+",
                      "S33+34",
                      "S35",
                      "S36",
                      "S37",
                      "S38+40",
                      "S42+45",
                      "2XL",
                      "XS/S",
                      "M/L",
                      "XL",
                      "XXL",
                    ].map((size) => (
                      <DropdownMenuItem
                        key={size}
                        onClick={() => {
                          const { productType, level } = getValues([
                            `orderItems[${index}].productType`,
                            `orderItems[${index}].level`,
                          ]);
                          updateUnitPrice(index, productType, size, level);
                          field.onChange(size);
                        }}
                      >
                        {size}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`orderItems[${index}].unitPrice`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Tooltip title="Unit Price" className="cursor-pointer">
                  <Input
                    {...field}
                    placeholder="Unit Price"
                    type="number"
                    readOnly
                    className="w-full"
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
            <FormItem>
              <FormControl>
                <Tooltip title="Quantity" className="cursor-pointer">
                  <Input {...field} placeholder="Quantity" type="number" />
                </Tooltip>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <MinusCircle
          onClick={() => remove(index)}
          style={{ width: "50px", height: "50px" }} // Adjust the size as needed
          className="cursor-pointer"
        />
      </div>
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
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
                level: "",
                productType: "",
                size: "",
                unitPrice: 0,
                quantity: 0,
              })
            }
            className="mt-5 w-full cursor-pointer"
          />
        </Tooltip>
        <div className="flex justify-end items-center">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="mr-2 mt-4"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="mt-4"
          >
            {loadingAddItems ? (
              <div className="loading-dots">Adding Items</div>
            ) : (
              "Add Items"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

AddOrderItems.propTypes = {
  selectedOrder: PropTypes.object,
};

export default AddOrderItems;
