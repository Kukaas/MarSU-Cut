import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditAccomplishmentSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const EditAccomplishment = ({ accomplishment }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(EditAccomplishmentSchema),
    defaultValues: {
      type: accomplishment?.type || "",
      accomplishment: accomplishment?.accomplishment || "",
    },
  });
  if (!accomplishment) {
    return null;
  }

  const handleEditAccomplishment = async (values, event) => {
    try {
      event.preventDefault();
      event.stopPropagation();
      setLoading(true);
      const res = await axios.put(
        `https://garments.kukaas.tech/api/v1/accomplishment-report/update/${accomplishment._id}`,
        values
      );
      if (res.status === 200) {
        toast.success("Accomplishment report updated successfully!", {
          action: {
            label: "Ok",
          },
        });
        form.reset();
      } else {
        toast.error("Uh oh! Something went wrong");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Uh oh! Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEditAccomplishment)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Accomplishment</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accomplishment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accomplishment</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              className="w-full"
              onClick={(event) => handleEditAccomplishment(event)}
            >
              {loading ? (
                <span className="loading-dots">Saving changes</span>
              ) : (
                "Save changes"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

EditAccomplishment.propTypes = {
  accomplishment: PropTypes.object.isRequired,
};

export default EditAccomplishment;
