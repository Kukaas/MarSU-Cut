// UI
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";

// others
import ToasterError from "@/lib/Toaster";
import { CreateAccomplishmentSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomInput from "../CustomInput";
import { DialogClose } from "@/components/ui/dialog";

const CreateAccomplishment = () => {
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
            <CustomInput
              form={form}
              name="type"
              label="Type"
              placeholder="eg. Pattern Making, Cutting, Sewing, etc."
            />
            <CustomInput
              form={form}
              name="accomplishment"
              label="Accomplishment"
              placeholder="eg. 100 pcs of shirt, 50 pcs of pants, etc."
            />
            <div className="flex items-center justify-end">
              <DialogClose asChild>
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="default" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 animate-spin" />
                    <span>Creating</span>
                  </div>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateAccomplishment;
