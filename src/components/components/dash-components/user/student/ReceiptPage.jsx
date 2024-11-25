import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Typography } from "antd";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster, toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSelector } from "react-redux";
import EditReciept from "@/components/components/forms/EditReciept";

function ReceiptsPage() {
  const { orderId } = useParams();
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceipts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/order/student/receipt/${orderId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setReceipts(res.data.receipts);
      } catch (error) {
        console.error("Error fetching receipts:", error);
        toast.error("Failed to load receipts.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [orderId]);

  const handleVerifyAndApprove = async (receipt) => {
    if (!receipt) {
      toast.error("No receipt selected for verification.");
      return;
    }

    try {
      setLoading(true);

      // Verify receipt
      const verifyRes = await axios.put(
        `http://localhost:3000/api/v1/order/student/receipt/verify/${orderId}/${receipt._id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (verifyRes.status === 200) {
        const updatedReceipt = verifyRes.data.receipt;
        updateReceipt(updatedReceipt);
        toast.success("Receipt verified successfully!");

        // Approve the order
        const updateOrderRes = await axios.put(
          `${BASE_URL}/api/v1/order/update/student/${orderId}`,
          { status: "APPROVED" },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (updateOrderRes.status === 200) {
          toast.success("Order approved successfully!");
          navigate(-1); // Navigate back after success
        } else {
          toast.error("Failed to update the order status.");
        }
      } else {
        toast.error("Failed to verify the receipt.");
      }
    } catch (error) {
      console.error("Error verifying receipt or approving order:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setDialogOpen(false); // Close modal after operation
    }
  };

  const handleVerify = async (receipt) => {
    if (!receipt) {
      toast.error("No receipt selected for verification.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `http://localhost:3000/api/v1/order/student/receipt/verify/${orderId}/${receipt._id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        const updatedReceipt = res.data.receipt;
        updateReceipt(updatedReceipt);
        toast.success("Receipt verified successfully!");
      } else {
        toast.error("Failed to verify the receipt.");
      }
    } catch (error) {
      console.error("Error verifying receipt:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setDialogOpen(false); // Close modal after operation
    }
  };

  const updateReceipt = (updatedReceipt) => {
    if (!updatedReceipt || !updatedReceipt._id) {
      console.error(
        "Invalid receipt data provided for update:",
        updatedReceipt
      );
      return;
    }

    const updatedReceipts = receipts.map((receipt) =>
      receipt._id === updatedReceipt._id ? updatedReceipt : receipt
    );
    setReceipts(updatedReceipts);
  };

  return (
    <div className="p-5">
      <Typography.Title
        level={2}
        className="mb-5 text-center text-black dark:text-white"
      >
        Receipts for Order {orderId}
      </Typography.Title>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="w-full shadow-lg">
              <div className="p-4 border-2 border-gray-800 rounded-lg">
                <Skeleton className="h-6 w-[150px] rounded-lg mb-2" />
                <Skeleton className="h-4 w-[100px] rounded-lg mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px] rounded-lg" />
                  <Skeleton className="h-4 w-[150px] rounded-lg" />
                  <Skeleton className="h-4 w-[180px] rounded-lg" />
                  <Skeleton className="h-4 w-[160px] rounded-lg" />
                </div>
                <Skeleton className="h-[250px] w-full rounded-lg mt-4" />
                <div className="p-3">
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {receipts.map((receipt, index) => (
            <Card key={index} className="w-full shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Receipt {index + 1}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {receipt.type}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">
                    OR Number: {receipt.ORNumber}
                  </p>
                  <p className="text-sm">
                    Amount: Php{receipt.amount.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    Date Paid: {new Date(receipt.datePaid).toLocaleDateString()}
                  </p>
                  {receipt.description && (
                    <p className="text-sm">
                      Description: {receipt.description}
                    </p>
                  )}
                </div>
                <img
                  src={receipt.url}
                  alt={`Receipt ${index + 1}`}
                  className="block w-full h-[250px] object-cover rounded-lg shadow-md"
                />
              </CardContent>
              <CardFooter>
                <div className="flex justify-between items-center w-full gap-2">
                  {currentUser.role === "Student" && (
                    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="w-full"
                          disabled={receipt.isVerified}
                          onClick={() => setSelectedReceipt(receipt)}
                        >
                          Edit Receipt
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-h-[550px] overflow-auto">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Edit Receipt</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to edit this receipt?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <EditReciept
                          selectedReceipt={selectedReceipt}
                          orderId={orderId}
                          updateReceipt={updateReceipt}
                        />
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {currentUser.isAdmin && receipt.type === "Down Payment" && (
                    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="w-full"
                          onClick={() => {
                            setSelectedReceipt(receipt);
                            setDialogOpen(true);
                          }}
                          disabled={receipt.isVerified}
                        >
                          Verify Receipt
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-h-[550px] overflow-auto">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Confirm Receipt Verification
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to verify this receipt? Once
                            verified, the order status will be updated to{" "}
                            <strong>APPROVED</strong>. This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel asChild>
                            <Button className="w-full text-black dark:text-white">
                              Cancel
                            </Button>
                          </AlertDialogCancel>
                          <Button
                            className="w-full"
                            type="submit"
                            onClick={() =>
                              handleVerifyAndApprove(selectedReceipt)
                            }
                          >
                            Verify Receipt
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {currentUser.isAdmin && receipt.type === "Full Payment" && (
                    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="w-full"
                          onClick={() => {
                            setSelectedReceipt(receipt);
                            setDialogOpen(true);
                          }}
                          disabled={receipt.isVerified}
                        >
                          Verify Receipt
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-h-[550px] overflow-auto">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Confirm Receipt Verification
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to verify this receipt? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel asChild>
                            <Button className="w-full text-black dark:text-white">
                              Cancel
                            </Button>
                          </AlertDialogCancel>
                          <Button
                            className="w-full"
                            type="submit"
                            onClick={() => handleVerify(selectedReceipt)}
                          >
                            Verify Receipt
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <a
                    href={receipt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      View Full Receipt
                    </Button>
                  </a>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-5">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default ReceiptsPage;
