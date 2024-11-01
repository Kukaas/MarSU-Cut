import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

const RentalDetails = ({ selectedRental }) => {
  if (!selectedRental) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <AlertDialogContent className="max-w-lg p-4 rounded-md shadow-lg md:max-w-xl">
      <AlertDialogHeader className="text-xl font-semibold ">
        Rental Details of {selectedRental.coordinatorName}
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

        <div className="flex justify-between">
          <span className="font-medium">Sizes Ordered:</span>
          <span>
            Small: {selectedRental.small}, Medium: {selectedRental.medium},
            Large: {selectedRental.large}, XL: {selectedRental.extraLarge}
          </span>
        </div>
      </div>

      <AlertDialogFooter className="mt-6">
        <AlertDialogCancel className="px-4 py-2 font-medium text-white rounded-md hover:bg-blue-700">
          Close
        </AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default RentalDetails;
