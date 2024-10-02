import { Form } from "@/components/ui/form";
import { measureCommercialJobSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomInput from "../custom-components/CustomInput";
import { useState } from "react";
import { AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import { Loader2 } from "lucide-react";

const MeasureMentForm = ({ selectedOrder, setIsDialogOpen }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(measureCommercialJobSchema),
    defaultValues: {
      sh: "",
      b: "",
      fbl: "",
      UAG: "",
      SL: "",
      W: "",
      H: "",
      Cr: "",
      Th: "",
      KL: "",
      PLBW: "",
    },
  });

  const handleMeasurement = async (data) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${BASE_URL}/api/v1/commercial-job/measure/${selectedOrder._id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setLoading(false);
        toast.success("Commercial order measured successfully", {
          description: "The commercial order has been measured successfully.",
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred", {
        description: "Please check your internet connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleMeasurement)}>
          <div className="flex justify-between w-full gap-2">
            <CustomInput
              form={form}
              label="SH"
              name="sh"
              type="text"
              placeholder="Enter SH"
            />
            <CustomInput
              form={form}
              label="B"
              name="b"
              type="text"
              placeholder="Enter B"
            />
          </div>
          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomInput
              form={form}
              label="FBL"
              name="fbl"
              type="text"
              placeholder="Enter FBL"
            />
            <CustomInput
              form={form}
              label="UAG"
              name="UAG"
              type="text"
              placeholder="Enter UAG"
            />
          </div>

          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomInput
              form={form}
              label="SL"
              name="SL"
              type="text"
              placeholder="Enter SL"
            />
            <CustomInput
              form={form}
              label="W"
              name="W"
              type="text"
              placeholder="Enter W"
            />
          </div>

          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomInput
              form={form}
              label="H"
              name="H"
              type="text"
              placeholder="Enter H"
            />
            <CustomInput
              form={form}
              label="Cr"
              name="Cr"
              type="text"
              placeholder="Enter Cr"
            />
          </div>

          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomInput
              form={form}
              label="Th"
              name="Th"
              type="text"
              placeholder="Enter Th"
            />
            <CustomInput
              form={form}
              label="KL"
              name="KL"
              type="text"
              placeholder="Enter KL"
            />
          </div>

          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomInput
              form={form}
              label="PLBW"
              name="PLBW"
              type="text"
              placeholder="Enter PLBW"
            />
          </div>

          <div className="flex items-center justify-end mt-4 gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={loading}>
              {loading ? (
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
  );
};

export default MeasureMentForm;
