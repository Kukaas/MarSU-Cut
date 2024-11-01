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
      LAG: "",
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
              label="Shoulder"
              name="sh"
              type="text"
              placeholder="Shoulder measurement"
            />
            <CustomInput
              form={form}
              label="Bust"
              name="b"
              type="text"
              placeholder="Bust measurement"
            />
          </div>
          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomInput
              form={form}
              label="Figure/Backlength"
              name="fbl"
              type="text"
              placeholder="Figure/Backlenth measurement"
            />
            <CustomInput
              form={form}
              label="Upper Arm Gurt"
              name="UAG"
              type="text"
              placeholder="UAG measurement"
            />
          </div>

          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomInput
              form={form}
              label="Sleeve Length"
              name="SL"
              type="text"
              placeholder="Sleeve Length measurement"
            />
            <CustomInput
              form={form}
              label="Lower Arm Gurt"
              name="LAG"
              type="text"
              placeholder="LAG measurement"
            />
          </div>

          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomInput
              form={form}
              label="Hips"
              name="H"
              type="text"
              placeholder="Hips measurement"
            />
            <CustomInput
              form={form}
              label="Waist Line"
              name="W"
              type="text"
              placeholder="Waiste Line measurement"
            />
          </div>

          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomInput
              form={form}
              label="Thigh"
              name="Th"
              type="text"
              placeholder="Thigh measurement"
            />
            <CustomInput
              form={form}
              label="Cronch"
              name="Cr"
              type="text"
              placeholder="Cronch measurement"
            />
          </div>

          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomInput
              form={form}
              label="Pants Length/Bottoms Width"
              name="PLBW"
              type="text"
              placeholder="PLBW measurement"
            />
            <CustomInput
              form={form}
              label="Knee Length"
              name="KL"
              type="text"
              placeholder="Knee Length measurement"
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
