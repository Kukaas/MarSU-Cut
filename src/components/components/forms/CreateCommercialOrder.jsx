import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";

// others
import ToasterError from "@/lib/Toaster";
import { AddCommercialJobSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomInput from "../CustomInput";

const CreateCommercialOrder = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [commercialOrderLoading, setCommercialOrderLoading] = useState(false);

  const handleCreateCommercialOrder = async (values) => {
    try {
      setCommercialOrderLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/commercial-job/create`,
        {
          userId: currentUser._id,
          idNumber: values.idNumber,
          cbName: values.cbName,
          cbEmail: currentUser.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        setCommercialOrderLoading(false);
        toast.success("Commercial order created successfully", {
          description: "Wait for the admin to approve your order.",
        });

        commercialJobForm.reset();
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
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
            <CustomInput
              form={commercialJobForm}
              name="idNumber"
              label="ID Number"
              placeholder="eg. 123456"
            />
            <CustomInput
              form={commercialJobForm}
              name="cbName"
              label="Commercial Job Name"
              placeholder="eg. Jhon Doe"
            />
            <div className="flex items-center justify-end gap-2">
              <DialogClose>
                <Button variant="outline" className="mt-3">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="mt-3"
                disabled={commercialOrderLoading}
              >
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
