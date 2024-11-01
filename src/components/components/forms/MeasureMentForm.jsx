import { Form } from "@/components/ui/form";
import { measureCommercialJobSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import { Loader2 } from "lucide-react";
import CustomNumberInput from "../custom-components/CustomNumberInput";

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
            <CustomNumberInput
              control={form.control}
              label="Shoulder"
              name="sh"
              type="number"
              placeholder="Shoulder measurement"
            />
            <CustomNumberInput
              control={form.control}
              label="Bust"
              name="b"
              type="number"
              placeholder="Bust measurement"
            />
          </div>
          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomNumberInput
              control={form.control}
              label="Figure/Backlength"
              name="fbl"
              type="number"
              placeholder="Figure/Backlength measurement"
            />
            <CustomNumberInput
              control={form.control}
              label="Upper Arm Gurt"
              name="UAG"
              type="number"
              placeholder="UAG measurement"
            />
          </div>

          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomNumberInput
              control={form.control}
              label="Sleeve Length"
              name="SL"
              type="number"
              placeholder="Sleeve Length measurement"
            />
            <CustomNumberInput
              control={form.control}
              label="Lower Arm Gurt"
              name="LAG"
              type="number"
              placeholder="LAG measurement"
            />
          </div>

          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomNumberInput
              control={form.control}
              label="Hips"
              name="H"
              type="number"
              placeholder="Hips measurement"
            />
            <CustomNumberInput
              control={form.control}
              label="Waist Line"
              name="W"
              type="number"
              placeholder="Waist Line measurement"
            />
          </div>

          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomNumberInput
              control={form.control}
              label="Thigh"
              name="Th"
              type="number"
              placeholder="Thigh measurement"
            />
            <CustomNumberInput
              control={form.control}
              label="Crotch"
              name="Cr"
              type="number"
              placeholder="Crotch measurement"
            />
          </div>

          <div className="flex justify-between w-full gap-2 mt-2">
            <CustomNumberInput
              control={form.control}
              label="Pants Length/Bottoms Width"
              name="PLBW"
              type="number"
              placeholder="PLBW measurement"
            />
            <CustomNumberInput
              control={form.control}
              label="Knee Length"
              name="KL"
              type="number"
              placeholder="Knee Length measurement"
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
                disabled={loading}
                className="w-full flex items-center justify-center"
              >
                {loading ? (
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
  );
};

export default MeasureMentForm;
