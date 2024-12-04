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

const RentalDetails = ({ selectedRental }) => {
  if (!selectedRental) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderSizes = (sizesObject) => {
    return Object.entries(sizesObject).map(([size, quantity]) => (
      <div key={size} className="flex justify-between mt-2">
        <span>{size}:</span> <span>{quantity}</span>
      </div>
    ));
  };

  return (
    <AlertDialogContent className="max-w-[500px] max-h-[600px] overflow-auto">
      <AlertDialogHeader>
        <AlertDialogTitle>
          Rental Details of {selectedRental.coordinatorName}
        </AlertDialogTitle>
        <AlertDialogDescription>
          This shows the rental details
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Coordinator Email:</span>
          <span>{selectedRental.coordinatorEmail}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Department:</span>
          <span>{selectedRental.department}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <span
            className={`font-semibold ${
              selectedRental.status === "APPROVED"
                ? "text-blue-500"
                : selectedRental.status === "RETURNED"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {selectedRental.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Possible Pickup Date:</span>
          <span>
            {selectedRental.possiblePickupDate
              ? formatDate(selectedRental.possiblePickupDate)
              : "Not Set"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Pickup Date:</span>
          <span>
            {selectedRental.pickupDate
              ? formatDate(selectedRental.pickupDate)
              : "Not Set"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Return Date:</span>
          <span>
            {selectedRental.returnDate
              ? formatDate(selectedRental.returnDate)
              : "Not Set"}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-center mt-4">
            <AlertDialogTitle>Sizes Ordered</AlertDialogTitle>
          </div>

          {/* Toga Sizes */}
          <div>
            <div className="font-medium">Toga Sizes:</div>
            {renderSizes(selectedRental.toga)}
          </div>

          {/* Cap Sizes */}
          <div>
            <div className="font-medium">Cap Sizes:</div>
            {renderSizes(selectedRental.cap)}
          </div>

          {/* Hood Quantity */}
          <div className="flex justify-between">
            <span className="font-medium">Hood:</span>
            <span>{selectedRental.hood}</span>
          </div>

          {/* Monaco Thread */}
          <div className="flex justify-between">
            <span className="font-medium">Monaco Thread:</span>
            <span>{selectedRental.monacoThread}</span>
          </div>
        </div>
      </div>

      <AlertDialogFooter className="mt-6">
        <AlertDialogCancel
          asChild
          className="px-4 py-2 font-medium text-white w-full"
        >
          <Button className="w-full text-black dark:text-white">Close</Button>
        </AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

RentalDetails.propTypes = {
  selectedRental: PropTypes.object,
};

export default RentalDetails;
