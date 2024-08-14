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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";

// others
import { Toaster } from "@/lib/Toaster";
import { CreateAccomplishmentSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
        
      });
      form.reset();
    } else {
      Toaster();
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
            <Button type="submit" variant="default" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 animate-spin" />
                  <span>Creating</span>
                </div>
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
