import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";

// others
import ToasterError from "@/lib/Toaster";
import { AddCommercialJobSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import CustomInput from "../custom-components/CustomInput";
import { AlertDialogCancel, AlertDialogFooter } from "@/components/ui/alert-dialog";

const CreateCommercialOrder = ({
  onCommercialOrderCreated,
  setIsDialogOpen,
}) => {
  const { currentUser } = useSelector((state) => state.user);
  const [commercialOrderLoading, setCommercialOrderLoading] = useState(false);

  const handleCreateCommercialOrder = async (values) => {
    try {
      setCommercialOrderLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/commercial-job/create`,
        {
          userId: currentUser._id,
          cbName: values.cbName,
          contactNumber: values.contactNumber,
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
        onCommercialOrderCreated(res.data);
        setIsDialogOpen(false);
      }
    } catch (error) {
      ToasterError({
        description: "Please check your internet connection and try again.",
      });
    } finally {
      setCommercialOrderLoading(false);
    }
  };

  const commercialJobForm = useForm({
    resolver: zodResolver(AddCommercialJobSchema),
    defaultValues: {
      contactNumber: "",
      cbName: currentUser.name,
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
            <div className="grid gap-4 mb-6">
              <CustomInput
                form={commercialJobForm}
                name="cbName"
                label="Commercial Job Name"
                placeholder="eg. Jhon Doe"
              />
              <CustomInput
                form={commercialJobForm}
                name="contactNumber"
                label="Contact Number"
                placeholder="eg. 0912345678"
              />
            </div>

            <div className="flex flex-col items-center gap-4 mt-4">
              <AlertDialogFooter className="w-full flex flex-col items-center gap-4">
                <AlertDialogCancel asChild>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <Button
                  type="submit"
                  disabled={commercialOrderLoading}
                  className="w-full flex items-center justify-center"
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
              </AlertDialogFooter>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

CreateCommercialOrder.propTypes = {
  onCommercialOrderCreated: PropTypes.func,
  setIsDialogOpen: PropTypes.func,
};

export default CreateCommercialOrder;
