// UI
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";

// others
import ToasterError from "@/lib/Toaster";
import { CreateAccomplishmentSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomInput from "../custom-components/CustomInput";
import SelectField from "../custom-components/SelectField";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const CreateAccomplishment = ({ onAccomplishmentCreate, setIsDialogOpen }) => {
  const [loading, setLoading] = useState();

  const form = useForm({
    resolver: zodResolver(CreateAccomplishmentSchema),
    defaultValues: {
      type: "",
      accomplishment: "",
    },
  });

  const handleCreateAccomplishment = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/accomplishment-report/create`,
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
        setLoading(false);
        toast.success("Accomplishment report created successfully!");
        form.reset();
        onAccomplishmentCreate(res.data.accomplishmentReport);
        setIsDialogOpen(false);
        console.log(res.data);
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateAccomplishment)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <SelectField
                  field={field}
                  label="Accomplishment Type"
                  options={["Cutting", "Sewing", "Pattern Making"]}
                  placeholder="Select a Type"
                />
              )}
            />
            <CustomInput
              form={form}
              name="accomplishment"
              label="Accomplishment"
              placeholder="eg. 100 pcs of shirt, 50 pcs of pants, etc."
            />
            <div className="flex flex-col items-center gap-4 mt-4">
              <AlertDialogFooter className="flex flex-col items-center gap-4 w-full">
                <AlertDialogCancel asChild>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </AlertDialogCancel>

                <Button
                  type="submit"
                  variant="default"
                  disabled={loading}
                  className="w-full flex items-center justify-center"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 animate-spin" />
                      <span>Creating</span>
                    </div>
                  ) : (
                    "Create"
                  )}
                </Button>
              </AlertDialogFooter>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

CreateAccomplishment.propTypes = {
  onAccomplishmentCreate: PropTypes.func,
  setIsDialogOpen: PropTypes.func,
};

export default CreateAccomplishment;
