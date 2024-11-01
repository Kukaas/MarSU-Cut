// UI
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// icons
import { Loader2 } from "lucide-react";

// others
import ToasterError from "@/lib/Toaster";
import { AddNewProductSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import SelectField from "../custom-components/SelectField";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import CustomNumberInput from "../custom-components/CustomNumberInput";

const AddNewProduct = ({ onProductAdded, setIsDialogOpen }) => {
  const [addNewProductLoading, setAddNewProductLoading] = useState(false);

  const addNewProductForm = useForm({
    resolver: zodResolver(AddNewProductSchema),
    defaultValues: {
      level: "",
      productType: "",
      size: "",
      quantity: 0,
    },
  });

  const productType = addNewProductForm.watch("productType");
  const sizes =
    productType === "POLO" || productType === "BLOUSE"
      ? ["S14", "S15", "S16", "S17", "S18", "S18+", "S19+"]
      : productType === "SKIRT" || productType === "PANTS"
      ? ["S24", "S25", "S26", "S27", "S28+"]
      : productType === "JPANTS"
      ? ["S33+34", "S35", "S36", "S37", "S38+40", "S42+45"]
      : productType === "PE TSHIRT"
      ? ["2XL", "XS/S", "M/L", "XL", "XXL"]
      : [];

  const handleAddNewProduct = async (values) => {
    if (
      !values.level ||
      !values.productType ||
      !values.size ||
      !values.quantity
    ) {
      return toast.error("Please fill all fields");
    }
    try {
      setAddNewProductLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/finished-product/create`,
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
        setAddNewProductLoading(false);
        toast.success("Product added successfully!");
        addNewProductForm.reset();
        onProductAdded(res.data.finishedProduct);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.log(error);
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    }
  };

  return (
    <Form {...addNewProductForm}>
      <form
        onSubmit={addNewProductForm.handleSubmit(handleAddNewProduct)}
        className="space-y-4 w-full p-3"
      >
        <FormField
          control={addNewProductForm.control}
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
          control={addNewProductForm.control}
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
              ]}
              placeholder="Type"
            />
          )}
        />
        <FormField
          control={addNewProductForm.control}
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

        <CustomNumberInput
          control={addNewProductForm.control}
          label="Quantity"
          name="quantity"
          placeholder="Quantity"
          type="number"
        />
        <div className="flex flex-col items-center gap-4">
          <AlertDialogFooter className="flex flex-col items-center gap-4 w-full">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </AlertDialogCancel>

            <Button
              type="submit"
              disabled={addNewProductLoading}
              className="flex items-center justify-center w-full"
            >
              {addNewProductLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 animate-spin" />
                  <span>Adding</span>
                </div>
              ) : (
                "Add Product"
              )}
            </Button>
          </AlertDialogFooter>
        </div>
      </form>
    </Form>
  );
};

AddNewProduct.propTypes = {
  onProductAdded: PropTypes.func,
  setIsDialogOpen: PropTypes.func,
};

export default AddNewProduct;
