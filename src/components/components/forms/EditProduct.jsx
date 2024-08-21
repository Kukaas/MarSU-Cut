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
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";

// others
import ToasterError from "@/lib/Toaster";
import { EditProductSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";

const EditProduct = ({ selectedProduct }) => {
  const [editProductLoading, setEditProductLoading] = useState(false);

  const editProductForm = useForm({
    resolver: zodResolver(EditProductSchema),
    defaultValues: {
      level: selectedProduct.level,
      productType: selectedProduct.productType,
      size: selectedProduct.size,
      quantity: selectedProduct.quantity,
    },
  });

  const handleEditProduct = async (values) => {
    if (
      !values.quantity ||
      !values.level ||
      !values.productType ||
      !values.size
    ) {
      return toast.error("Please fill all fields");
    }

    try {
      setEditProductLoading(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/finished-product/update/${selectedProduct._id}`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setEditProductLoading(false);
        toast.success("Product updated successfully!");
        editProductForm.reset({
          level: "",
          productType: "",
          size: "",
          price: 0,
        });
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    }
  };

  return (
    <Form {...editProductForm}>
      <form
        onSubmit={editProductForm.handleSubmit(handleEditProduct)}
        className="space-y-4 w-full p-3"
      >
        <FormField
          control={editProductForm.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="block w-full text-start"
                      variant="outline"
                    >
                      {field.value || "Select level"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => field.onChange("SHS")}>
                      SHS
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => field.onChange("College")}
                    >
                      College
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={editProductForm.control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poduct Type</FormLabel>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="block w-full text-start"
                      variant="outline"
                    >
                      {field.value || "Select product type"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[
                      "SKIRT",
                      "POLO",
                      "PANTS",
                      "BLOUSE",
                      "PE TSHIRT",
                      "PE JOGGING PANT",
                    ].map((type) => (
                      <DropdownMenuItem
                        key={type}
                        onSelect={() => field.onChange(type)}
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
          control={editProductForm.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="block w-full text-start"
                      variant="outline"
                    >
                      {field.value || "Select product type"}
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
                    ].map((size) => (
                      <DropdownMenuItem
                        key={size}
                        onSelect={() => field.onChange(size)}
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
          control={editProductForm.control}
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
        <div className="flex items-center justify-end gap-2">
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={editProductLoading}>
            {editProductLoading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 animate-spin" />
                <span>Updating</span>
              </div>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

EditProduct.propTypes = {
  selectedProduct: PropTypes.object.isRequired,
};

export default EditProduct;
