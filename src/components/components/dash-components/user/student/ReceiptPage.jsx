import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AddNewReceipt from "@/components/components/forms/AddNewReceipt";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";

function ReceiptsPage() {
  const { orderId } = useParams();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFullPayment, setIsFullPayment] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

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
        const fetchedReceipts = res.data.receipts;
        setReceipts(fetchedReceipts);

        // Check if any receipt has type "Full Payment"
        const hasFullPayment = fetchedReceipts.some(
          (receipt) => receipt.type === "Full Payment"
        );
        setIsFullPayment(hasFullPayment);
      } catch (error) {
        console.error("Error fetching receipts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [orderId]);

  const addNewReceipt = () => {
    setIsDialogOpen(false);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
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
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button
          className="py-2 mr-2"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        {currentUser.isAdmin === false && (
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger disabled={isFullPayment}>
              <Button disabled={isFullPayment}>Add New Receipt</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Upload a new receipt</AlertDialogTitle>
                <AlertDialogDescription>
                  Upload a new receipt for order {orderId}
                </AlertDialogDescription>
                <AddNewReceipt
                  addNewReceipt={addNewReceipt}
                  orderId={orderId}
                />
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}

export default ReceiptsPage;
