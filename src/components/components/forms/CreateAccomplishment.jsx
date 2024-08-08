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
import { CreateAccomplishmentSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
    setLoading(true);
    const res = await axios.post(
      "https://marsu.cut.server.kukaas.tech/api/v1/accomplishment-report/create",
      values
    );
    if (res.status === 201) {
      setLoading(false);
      toast.success("Accomplishment report created successfully!", {
        action: {
          label: "Ok",
        },
      });
      form.reset();
    } else {
      toast.error("Uh oh! Something went wrong");
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
                <FormItem>
                  <FormLabel>Type of Accomplishment</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="eg. Pattern Making, Cutting, Sewing, etc."
                      {...field}
                    />
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
                    <Input
                      placeholder="eg. 10 pcs of T-shirts, 5 pcs of Pants, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="default" className="w-full">
              {loading ? (
                <span className="loading-dots">Creating</span>
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateAccomplishment;
