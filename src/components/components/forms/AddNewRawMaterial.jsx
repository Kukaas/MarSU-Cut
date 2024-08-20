// UI
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// others
import ToasterError from "@/lib/Toaster";
import { AddRawMaterialsSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";

const AddNewRawMaterial = () => {
  const [addRawMaterialLoading, setAddRawMaterialLoading] = useState(false);

  const addRawMaterialForm = useForm({
    resolver: zodResolver(AddRawMaterialsSchema),
    defaultValues: {
      type: "",
      unit: "",
      quantity: 0,
    },
  });

  const handleAddRawMaterial = async (values) => {
    try {
      setAddRawMaterialLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/raw-materials/new`,
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
        setAddRawMaterialLoading(false);
        toast.success("Raw material added successfully");
        addRawMaterialForm.reset();
      }
    } catch (error) {
      setAddRawMaterialLoading(false);
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    }
  };

  return (
    <Form {...addRawMaterialForm}>
      <form
        onSubmit={addRawMaterialForm.handleSubmit(handleAddRawMaterial)}
        className="space-y-4 w-full p-3"
      >
        <FormField
          control={addRawMaterialForm.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g Needle" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={addRawMaterialForm.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g Yard" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={addRawMaterialForm.control}
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
          <Button type="submit" disabled={addRawMaterialLoading}>
            {addRawMaterialLoading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 animate-spin" />
                <span>Adding</span>
              </div>
            ) : (
              "Add Material"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddNewRawMaterial;
