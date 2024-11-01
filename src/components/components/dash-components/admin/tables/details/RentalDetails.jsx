import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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
    <AlertDialogContent>
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
          <div className="flex justify-between">
            <span>Small:</span> <span>{selectedRental.small}</span>
          </div>
          <div className="flex justify-between">
            <span>Medium:</span> <span>{selectedRental.medium}</span>
          </div>
          <div className="flex justify-between">
            <span>Large:</span> <span>{selectedRental.large}</span>
          </div>
          <div className="flex justify-between">
            <span>Extra Large:</span> <span>{selectedRental.extraLarge}</span>
          </div>
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

export default RentalDetails;
