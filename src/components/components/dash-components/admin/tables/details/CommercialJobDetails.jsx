import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";

const CommercialJobDetails = ({ selectedOrder }) => {
  if (!selectedOrder) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const measurements = [
    { label: "Shoulder", key: "sh" },
    { label: "Bust", key: "b" },
    { label: "Figure/Backlength", key: "fbl" },
    { label: "Upper Arm Gurt", key: "UAG" },
    { label: "Lower Arm Gurt", key: "LAG" },
    { label: "Sleeve Length", key: "SL" },
    { label: "Waist Line", key: "W" },
    { label: "Hips", key: "H" },
    { label: "Crotch", key: "Cr" },
    { label: "Thigh", key: "Th" },
    { label: "Knee Length", key: "KL" },
    { label: "Pants Length/Bottoms Width", key: "PLBW" },
  ];

  return (
    <AlertDialogContent className="h-[500px] overflow-auto">
      <AlertDialogHeader>
        <AlertDialogTitle>
          Commercial Job Details of {selectedOrder.cbName}
        </AlertDialogTitle>
        <AlertDialogDescription>
          This shows the commercial job order details
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Contact Number:</span>
          <span>{selectedOrder.contactNumber || "Not Set"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Email:</span>
          <span>{selectedOrder.cbEmail || "Not Set"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <span
            className={`font-semibold ${
              selectedOrder.status === "APPROVED"
                ? "text-blue-500"
                : selectedOrder.status === "MEASURED"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {selectedOrder.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Scheduled Date:</span>
          <span>
            {selectedOrder.schedule
              ? formatDate(selectedOrder.schedule)
              : "Not Set"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Created At:</span>
          <span>{formatDate(selectedOrder.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Last Updated:</span>
          <span>{formatDate(selectedOrder.updatedAt)}</span>
        </div>

        {/* Measurements */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-center mt-4">
            <h2 className="font-medium text-lg">Measurements</h2>
          </div>

          {measurements.map(({ label, key }) => (
            <div className="flex justify-between" key={key}>
              <span>{label}:</span>
              <span>
                {selectedOrder[key]
                  ? `${selectedOrder[key]} cm`
                  : "Not yet Measured"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <AlertDialogFooter className="mt-6">
        <AlertDialogCancel
          asChild
          className="px-4 py-2 font-medium text-white w-full"
        >
          <Button className="w-full">Close</Button>
        </AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

CommercialJobDetails.propTypes = {
  selectedOrder: PropTypes.object,
};

export default CommercialJobDetails;
