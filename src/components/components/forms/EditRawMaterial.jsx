// UI
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import ToasterError from "@/lib/Toaster";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import CustomNumberInput from "../custom-components/CustomNumberInput";

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
    if (!values.quantity || !values.type || !values.unit) {
      return toast.error("Please fill all fields");
    }
    try {
      setEditRawMaterialLoading(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/raw-materials/update/${selectedRawMaterial._id}`,
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
        setEditRawMaterialLoading(false);
        toast.success("Raw material updated");
        editRawMaterialForm.reset();
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    } finally {
      setEditRawMaterialLoading(false);
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
        <CustomNumberInput
          control={editRawMaterialForm.control}
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
              disabled={editRawMaterialLoading}
              className="w-full flex items-center justify-center"
            >
              {editRawMaterialLoading ? (
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

EditRawMaterial.propTypes = {
  selectedRawMaterial: PropTypes.object,
};

export default EditRawMaterial;
