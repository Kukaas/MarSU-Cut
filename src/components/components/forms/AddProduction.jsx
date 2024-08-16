// UI
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
import { SheetClose, SheetTitle } from "@/components/ui/sheet";
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
import { format } from "date-fns";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { token } from "@/lib/token";

const AddProduction = () => {
  const [addProductionLoading, setAddProductionLoading] = useState(false);
  const productionForm = useForm({
    resolver: zodResolver(AddProductionSchema),
    defaultValues: {
      productType: "",
      size: "",
      level: "",
      productionDateFrom: "",
      productionDateTo: "",
      quantity: 0,
      rawMaterialsUsed: [{ type: "", quantity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: productionForm.control,
    name: "rawMaterialsUsed",
  });

  const handleAddProduction = async (values) => {
    try {
      setAddProductionLoading(true);
      const res = await axios.post(
        "https://marsu.cut.server.kukaas.tech/api/v1/production/create",
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
      }
    } catch (error) {
      setAddProductionLoading(false);
      ToasterError();
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
            <div className="flex w-full justify-between gap-2">
              <FormField
                control={productionForm.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="w-full overflow-y-auto"
                            variant="outline"
                          >
                            {field.value || "Level"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {["SHS", "COLLEGE"].map((level) => (
                            <DropdownMenuItem
                              key={level}
                              onClick={() => {
                                field.onChange(level);
                              }}
                            >
                              {level}
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
                control={productionForm.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="w-full overflow-y-auto"
                            variant="outline"
                          >
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
              <FormField
                control={productionForm.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="w-full overflow-y-auto"
                            variant="outline"
                          >
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
            </div>
            <div className="flex space-x-4 mt-4">
              <FormField
                control={productionForm.control}
                name="productionDateFrom" // Ensure this matches the name in your schema
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Production Date From</FormLabel>
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
                              format(new Date(field.value), "PPP")
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
                          selected={field.value ? new Date(field.value) : null}
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
                name="productionDateTo" // Ensure this matches the name in your schema
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Production Date To</FormLabel>
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
                              format(new Date(field.value), "PPP")
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
                          selected={field.value ? new Date(field.value) : null}
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

            <FormField
              control={productionForm.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value !== undefined ? field.value : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value !== "" ? parseFloat(value) : "");
                      }}
                      placeholder="Quantity"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetTitle className="mt-4">Raw Materials Used</SheetTitle>
            <div className="space-y-4 mt-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-4">
                  <FormField
                    control={productionForm.control}
                    name={`rawMaterialsUsed.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g Needle"
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={productionForm.control}
                    name={`rawMaterialsUsed.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value !== undefined ? field.value : ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value !== "" ? parseFloat(value) : ""
                              );
                            }}
                            placeholder="Quantity"
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Tooltip title="Remove input">
                    <MinusCircle
                      size={24}
                      onClick={() => remove(index)}
                      className="mt-8"
                    />
                  </Tooltip>
                </div>
              ))}
              <div className="flex justify-center mt-3">
                <Tooltip title="Add new input">
                  <PlusCircle
                    size={24}
                    onClick={() => append({ type: "", quantity: 0 })}
                    className="flex items-center justify-center"
                  />
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <SheetClose>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button onClick={handleButtonClick} type="button">
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

export default AddProduction;
