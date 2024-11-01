import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CommercialJobDetails = ({ selectedOrder }) => {
  if (!selectedOrder) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

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
          <div className="flex justify-between">
            <span>Shoulder:</span> <span>{selectedOrder.sh} cm</span>
          </div>
          <div className="flex justify-between">
            <span>Bust:</span> <span>{selectedOrder.b} cm</span>
          </div>
          <div className="flex justify-between">
            <span>Figure/Backlength:</span> <span>{selectedOrder.fbl} cm</span>
          </div>
          <div className="flex justify-between">
            <span>Upper Arm Gurt:</span> <span>{selectedOrder.UAG} cm</span>
          </div>
          <div className="flex justify-between">
            <span>Lower Arm Gurt:</span> <span>{selectedOrder.LAG} cm</span>
          </div>
          <div className="flex justify-between">
            <span>Sleeve Length:</span> <span>{selectedOrder.SL} cm</span>
          </div>
          <div className="flex justify-between">
            <span>Waiste Line:</span> <span>{selectedOrder.W} cm</span>
          </div>
          <div className="flex justify-between">
            <span>Hips:</span> <span>{selectedOrder.H} cm</span>
          </div>
          <div className="flex justify-between">
            <span>Cronch:</span> <span>{selectedOrder.Cr} cm</span>
          </div>
          <div className="flex justify-between">
            <span>Thigh:</span> <span>{selectedOrder.Th} cm</span>
          </div>
          <div className="flex justify-between">
            <span>Knee Length:</span> <span>{selectedOrder.KL} cm</span>
          </div>
          <div className="flex justify-between">
            <span>Pants Length/Bottoms Width:</span>{" "}
            <span>{selectedOrder.PLBW} cm</span>
          </div>
        </div>
      </div>

      <AlertDialogFooter className="mt-6">
        <AlertDialogCancel className="px-4 py-2 font-medium ">
          Close
        </AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default CommercialJobDetails;
