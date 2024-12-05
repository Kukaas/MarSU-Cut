import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";
import { PropTypes } from "prop-types";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const ReleaseAcademicGown = ({
  selectedRentalOrder,
  onReleaseSuccess,
  setDialogReleaseOpen,
}) => {
  const [finishedProducts, setFinishedProducts] = useState({
    toga: {
      S14: 0,
      S15: 0,
      S16: 0,
      S17: 0,
      S18: 0,
      S19: 0,
      S20: 0,
      "S20+": 0,
    },
    cap: {
      "M/L": 0,
      XL: 0,
      XXL: 0,
    },
    hood: 0,
    monacoThread: 0,
  });

  const [loading, setLoading] = useState(false);

  // Setting default form values based on selected rental order
  const form = useForm({
    defaultValues: {
      ...selectedRentalOrder,
      coordinatorName: selectedRentalOrder.name,
      department: selectedRentalOrder.department,
      possiblePickupDate: new Date(),
      toga: selectedRentalOrder.toga || {
        S14: 0,
        S15: 0,
        S16: 0,
        S17: 0,
        S18: 0,
        S19: 0,
        S20: 0,
        "S20+": 0,
      },
      cap: selectedRentalOrder.cap || {
        "M/L": 0,
        XL: 0,
        XXL: 0,
      },
      hood: selectedRentalOrder.hood || 0,
      monacoThread: selectedRentalOrder.monacoThread || 0,
    },
  });

  const handleReleaseItems = async (values) => {
    try {
      setLoading(true);

      // Adjusting the release logic
      const res = await axios.put(
        `${BASE_URL}/api/v1/rental/release`,
        {
          ...values,
          rentalId: selectedRentalOrder._id,
        },
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
        toast.success("Items released successfully!");
        onReleaseSuccess(res.data.releasedRental);
        setDialogReleaseOpen(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 py-4 overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleReleaseItems)}
          className="space-y-6 w-full overflow-y-auto"
        >
          {/* Toga Sizes */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">Toga Sizes</legend>
            <div className="space-y-4">
              {finishedProducts.toga &&
                Object.keys(finishedProducts.toga).map((size) => (
                  <FormField
                    key={size}
                    control={form.control}
                    name={`toga.${size}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <div className="flex gap-2 items-center">
                          <FormLabel>{size}</FormLabel>
                          <span>({selectedRentalOrder.toga[size]})</span>
                        </div>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Quantity"
                          value={field.value || ""}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value, 10);
                            field.onChange(isNaN(newValue) ? "" : newValue);
                          }}
                        />
                      </FormItem>
                    )}
                  />
                ))}
            </div>
          </fieldset>

          {/* Cap Sizes */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">Cap Sizes</legend>
            <div className="space-y-4">
              {finishedProducts.cap &&
                Object.keys(finishedProducts.cap).map((size) => (
                  <FormField
                    key={size}
                    control={form.control}
                    name={`cap.${size}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <div className="flex gap-2 items-center">
                          <FormLabel>{size}</FormLabel>
                          <span>({selectedRentalOrder.cap[size]})</span>
                        </div>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Quantity"
                          value={field.value || ""}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value, 10);
                            field.onChange(isNaN(newValue) ? "" : newValue);
                          }}
                        />
                      </FormItem>
                    )}
                  />
                ))}
            </div>
          </fieldset>

          {/* Hood */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">Hood</legend>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="hood"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <FormLabel>Hood</FormLabel>
                      <span>({selectedRentalOrder.hood})</span>
                    </div>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Quantity"
                      value={field.value || ""}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value, 10);
                        field.onChange(isNaN(newValue) ? "" : newValue);
                      }}
                    />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          {/* Monaco Thread */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">Monaco Thread</legend>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="monacoThread"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <FormLabel>Monaco Thread</FormLabel>
                      <span>({selectedRentalOrder.monacoThread})</span>
                    </div>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Quantity"
                      value={field.value || ""}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value, 10);
                        field.onChange(isNaN(newValue) ? "" : newValue);
                      }}
                    />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          {/* Submit Button */}
          <div className="flex flex-col items-center">
            <AlertDialogFooter className="flex flex-col items-center w-full gap-2">
              <AlertDialogCancel asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Release Items"
                )}
              </Button>
            </AlertDialogFooter>
          </div>
        </form>
      </Form>
    </div>
  );
};

ReleaseAcademicGown.propTypes = {
  selectedRentalOrder: PropTypes.object.isRequired,
  onReleaseSuccess: PropTypes.func.isRequired,
  setDialogReleaseOpen: PropTypes.func.isRequired,
};

export default ReleaseAcademicGown;
