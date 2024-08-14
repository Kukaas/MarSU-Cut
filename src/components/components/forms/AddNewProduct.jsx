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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/lib/Toaster";
import { AddNewProductSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AddNewProduct = () => {
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

  const handleAddNewProduct = async (values) => {
    setAddNewProductLoading(true);
    try {
      const res = await axios.post(
        "https://marsu.cut.server.kukaas.tech/api/v1/finished-product/create",
        values
      );

      if (res.status === 201) {
        setAddNewProductLoading(false);
        toast.success("Product added successfully!", {
          action: {
            label: "Ok",
          },
        });
        addNewProductForm.reset();
      }
    } catch (error) {
      console.log(error);
      Toaster();
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
                      onSelect={() => field.onChange("COLLEGE")}
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
        <FormField
          control={addNewProductForm.control}
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
                      "JPANTS",
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
          control={addNewProductForm.control}
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
                      {field.value || "Select a size"}
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
          control={addNewProductForm.control}
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
          <Button type="submit" disabled={addNewProductLoading}>
            {addNewProductLoading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 animate-spin" />
                <span>Adding</span>
              </div>
            ) : (
              "Add Product"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddNewProduct;
