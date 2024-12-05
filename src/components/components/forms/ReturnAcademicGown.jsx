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
import { format } from "date-fns";
import { PropTypes } from "prop-types";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const ReturnAcademicGown = ({
  selectedRentalOrder,
  onReturnSuccess,
  setIsDialogOpen,
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

  const form = useForm({
    defaultValues: {
      coordinatorName: selectedRentalOrder.name,
      department: selectedRentalOrder.department,
      possiblePickupDate: new Date(),
      toga: {
        S14:
          selectedRentalOrder.toga.S14 -
          selectedRentalOrder.returnedItems.toga.S14,
        S15:
          selectedRentalOrder.toga.S15 -
          selectedRentalOrder.returnedItems.toga.S15,
        S16:
          selectedRentalOrder.toga.S16 -
          selectedRentalOrder.returnedItems.toga.S16,
        S17:
          selectedRentalOrder.toga.S17 -
          selectedRentalOrder.returnedItems.toga.S17,
        S18:
          selectedRentalOrder.toga.S18 -
          selectedRentalOrder.returnedItems.toga.S18,
        S19:
          selectedRentalOrder.toga.S19 -
          selectedRentalOrder.returnedItems.toga.S19,
        S20:
          selectedRentalOrder.toga.S20 -
          selectedRentalOrder.returnedItems.toga.S20,
        "S20+":
          selectedRentalOrder.toga["S20+"] -
          selectedRentalOrder.returnedItems.toga["S20+"],
      },
      cap: {
        "M/L":
          selectedRentalOrder.cap["M/L"] -
          selectedRentalOrder.returnedItems.cap["M/L"],
        XL:
          selectedRentalOrder.cap.XL - selectedRentalOrder.returnedItems.cap.XL,
        XXL:
          selectedRentalOrder.cap.XXL -
          selectedRentalOrder.returnedItems.cap.XXL,
      },
      hood: selectedRentalOrder.hood - selectedRentalOrder.returnedItems.hood,
      monacoThread:
        selectedRentalOrder.monacoThread -
        selectedRentalOrder.returnedItems.monacoThread,
    },
  });

  const handleReturnItems = async (values) => {
    try {
      setLoading(true);

      // Prepare the release payload with returned items
      const releaseData = {
        rentalId: selectedRentalOrder._id,
        returnedItems: {
          toga: {
            S14: values.toga.S14 || 0,
            S15: values.toga.S15 || 0,
            S16: values.toga.S16 || 0,
            S17: values.toga.S17 || 0,
            S18: values.toga.S18 || 0,
            S19: values.toga.S19 || 0,
            S20: values.toga.S20 || 0,
            "S20+": values.toga["S20+"] || 0,
          },
          cap: {
            "M/L": values.cap["M/L"] || 0,
            XL: values.cap.XL || 0,
            XXL: values.cap.XXL || 0,
          },
          hood: values.hood || 0,
          monacoThread: values.monacoThread || 0,
        },
      };

      const res = await axios.put(
        `http://localhost:3000/api/v1/rental/return`,
        releaseData,
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
        onReturnSuccess();
        setIsDialogOpen(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 py-4 overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleReturnItems)}
          className="space-y-6 w-full overflow-y-auto"
        >
          {/* Rental Order Details */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-lg font-semibold">
              Rental Order Details
            </legend>
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <FormLabel>Coordinator Name</FormLabel>
                <span>{form.watch("coordinatorName")}</span>
              </div>
              <div className="flex gap-2 items-center">
                <FormLabel>Department</FormLabel>
                <span>{form.watch("department")}</span>
              </div>
              <div className="flex gap-2 items-center">
                <FormLabel>Date Needed</FormLabel>
                <span>
                  {format(form.watch("possiblePickupDate"), "MMMM dd, yyyy")}
                </span>
              </div>
            </div>
          </fieldset>

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
                          <span>({form.getValues(`toga.${size}`)})</span>
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
                          disabled={form.getValues(`toga.${size}`) === 0} // Disable input if the default value is 0
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
                          <span>({finishedProducts.cap[size]})</span>
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
                          disabled={form.getValues(`cap.${size}`) === 0}
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
                      <span>({finishedProducts.hood})</span>
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
                      disabled={form.getValues("hood") === 0}
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
                      <span>({finishedProducts.monacoThread})</span>
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
                      disabled={form.getValues(`monacoThread`) === 0}
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
                  "Return Items"
                )}
              </Button>
            </AlertDialogFooter>
          </div>
        </form>
      </Form>
    </div>
  );
};

ReturnAcademicGown.propTypes = {
  selectedRentalOrder: PropTypes.object.isRequired,
  onReturnSuccess: PropTypes.func.isRequired,
  setIsDialogOpen: PropTypes.func.isRequired,
};

export default ReturnAcademicGown;
