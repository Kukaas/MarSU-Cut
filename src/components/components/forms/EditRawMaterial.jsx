// UI
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";

// others
import { EditRawMAterialsSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { Toaster } from "@/lib/Toaster";

const EditRawMaterial = ({ selectedRawMaterial }) => {
  const [editRawMaterialLoading, setEditRawMaterialLoading] = useState(false);

  const editRawMaterialForm = useForm({
    resolver: zodResolver(EditRawMAterialsSchema),
    defaultValues: {
      type: selectedRawMaterial?.type,
      quantity: selectedRawMaterial?.quantity,
      unit: selectedRawMaterial?.unit,
    },
  });

  const handleEditRawMaterial = async (values) => {
    try {
      setEditRawMaterialLoading(true);
      const res = await axios.put(
        `https://marsu.cut.server.kukaas.tech/api/v1/raw-materials/update/${selectedRawMaterial._id}`,
        values
      );

      if (res.status === 200) {
        setEditRawMaterialLoading(false);
        toast.success("Raw material updated", {
          
        });
        editRawMaterialForm.reset();
      }
    } catch (error) {
      Toaster();
    }
  };

  return (
    <Form {...editRawMaterialForm}>
      <form
        onSubmit={editRawMaterialForm.handleSubmit(handleEditRawMaterial)}
        className="space-y-4 w-full p-3"
      >
        <FormField
          control={editRawMaterialForm.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={editRawMaterialForm.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={editRawMaterialForm.control}
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
          <Button type="submit" disabled={editRawMaterialLoading}>
            {editRawMaterialLoading ? (
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

EditRawMaterial.propTypes = {
  selectedRawMaterial: PropTypes.object,
};

export default EditRawMaterial;
