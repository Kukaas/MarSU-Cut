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
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import CustomNumberInput from "../custom-components/CustomNumberInput";

const EditProduct = ({
  selectedProduct,
  setIsDialogOpen,
  onProductUpdated,
}) => {
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
        setIsDialogOpen(false);
        onProductUpdated(res.data.finishedProduct); // Pass the updated product
        setIsDialogOpen(false);
        console.log(res.data);
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    } finally {
      setEditProductLoading(false);
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
        <CustomNumberInput
          control={editProductForm.control}
          label="Quantity"
          name="quantity"
          placeholder="Quantity"
          type="number"
        />
        <div className="flex flex-col items-center gap-4 mt-4">
          <AlertDialogFooter className="w-full flex flex-col items-center gap-4">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="submit"
              disabled={editProductLoading}
              className="w-full flex items-center justify-center"
            >
              {editProductLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 animate-spin" />
                  <span>Updating</span>
                </div>
              ) : (
                "Update"
              )}
            </Button>
          </AlertDialogFooter>
        </div>
      </form>
    </Form>
  );
};

EditProduct.propTypes = {
  selectedProduct: PropTypes.object,
  setIsDialogOpen: PropTypes.func,
  onProductUpdated: PropTypes.func,
};

export default EditProduct;
