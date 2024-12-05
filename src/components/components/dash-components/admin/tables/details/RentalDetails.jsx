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

  const renderGroupedRows = (type, rentedSizes = {}, returnedSizes = {}) => {
    return (
      <div key={type} className="border-b py-4">
        <div className="font-medium text-center">{type}</div>
        {Object.entries(rentedSizes).map(([size, rentedQty]) => {
          const returnedQty = returnedSizes[size] || 0; // Default to 0 if not returned
          const rowColor =
            rentedQty === returnedQty ? "text-green-500" : "text-red-500";

          return (
            <div
              key={`${type}-${size}`}
              className="flex justify-between py-2 border-t"
            >
              <div className="w-1/3 text-center">{size}</div>
              <div className="w-1/3 text-center">{rentedQty}</div>
              <div className={`w-1/3 text-center ${rowColor}`}>
                {returnedQty}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSingleRow = (type, rentedQty, returnedQty) => {
    const rowColor =
      rentedQty === returnedQty ? "text-green-500" : "text-red-500";

    return (
      <div key={type} className="flex justify-between py-4 border-b">
        <div className="w-1/3 text-center">{type}</div>
        <div className="w-1/3 text-center">{rentedQty}</div>
        <div className={`w-1/3 text-center ${rowColor}`}>{returnedQty}</div>
      </div>
    );
  };

  return (
    <AlertDialogContent className="max-w-[600px] max-h-[600px] overflow-auto">
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
                : selectedRental.status === "PARTIALLY RETURNED"
                ? "text-yellow-500"
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
      </div>

      <div className="mt-6">
        <div className="text-lg font-semibold text-center">Rental Summary</div>
        <div className="flex justify-between font-medium border-b py-2">
          <div className="w-1/3 text-center">Product Type / Sizes</div>
          <div className="w-1/3 text-center">Total Rented Items</div>
          <div className="w-1/3 text-center">Returned Items</div>
        </div>

        {/* Toga Sizes */}
        {renderGroupedRows(
          "Toga",
          selectedRental.toga,
          selectedRental.returnedItems?.toga
        )}

        {/* Cap Sizes */}
        {renderGroupedRows(
          "Cap",
          selectedRental.cap,
          selectedRental.returnedItems?.cap
        )}

        {/* Hood */}
        {renderSingleRow(
          "Hood",
          selectedRental.hood,
          selectedRental.returnedItems?.hood || 0
        )}

        {/* Monaco Thread */}
        {renderSingleRow(
          "Monaco Thread",
          selectedRental.monacoThread,
          selectedRental.returnedItems?.monacoThread || 0
        )}
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
