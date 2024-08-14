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
import { AddCommercialJobSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const CreateCommercialOrder = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [commercialOrderLoading, setCommercialOrderLoading] = useState(false);

  const handleCreateCommercialOrder = async (values) => {
    try {
      setCommercialOrderLoading(true);
      const res = await axios.post(
        "https://marsu.cut.server.kukaas.tech/api/v1/commercial-job/create",
        {
          userId: currentUser._id,
          idNumber: values.idNumber,
          cbName: values.cbName,
          cbEmail: currentUser.email,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        setCommercialOrderLoading(false);
        toast.success("Commercial order created successfully", {
          action: {
            label: "Ok",
          },
        });

        commercialJobForm.reset();
      }
    } catch (error) {
      toast.error("Uh oh! Something went wrong", {
        action: {
          label: "Ok",
        },
      });
    }
  };

  const commercialJobForm = useForm({
    resolver: zodResolver(AddCommercialJobSchema),
    defaultValues: {
      idNumber: "",
      cbName: "",
    },
  });
  return (
    <div className="grid gap-4 py-4">
      <div className="w-full">
        <Form {...commercialJobForm}>
          <form
            className="space-y-1 w-full"
            onSubmit={commercialJobForm.handleSubmit(
              handleCreateCommercialOrder
            )}
          >
            <FormField
              control={commercialJobForm.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="eg.21B994" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={commercialJobForm.control}
              name="cbName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="eg. John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-2">
              <DialogClose>
                <Button variant="outline" className="mt-3">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="mt-3" disabled={commercialOrderLoading}>
                {commercialOrderLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 animate-spin" />
                    <span>Submitting</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCommercialOrder;
