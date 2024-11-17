import { Typography } from "antd";
import { Helmet } from "react-helmet";
import { toast, Toaster } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import { statusColors } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const StatusBadge = ({ status }) => {
  const { color, badgeText } = statusColors[status] || statusColors.default;

  return (
    <div className="status-badge flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <p className="text-xs font-semibold" style={{ color }}>
        {badgeText}
      </p>
    </div>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

const OrderItems = ({ orderItems, finishedProducts }) => {
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return <div className="text-gray-600">Not yet Measured</div>;
  }

  const productAvailability = finishedProducts.reduce((acc, product) => {
    const key = `${product.productType}-${product.size}-${product.level}`;
    if (!acc[key]) {
      acc[key] = product.quantity;
    }
    return acc;
  }, {});

  const groupedItems = orderItems.reduce((acc, item) => {
    const key = `${item.productType}-${item.size}-${item.level}`;
    if (!acc[key]) {
      acc[key] = { ...item, quantity: 0 };
    }
    acc[key].quantity += item.quantity;
    return acc;
  }, {});

  const itemsToRender = Object.values(groupedItems);

  return (
    <div className="space-y-2">
      {itemsToRender.map((item, index) => {
        const availableQuantity =
          item.productType === "LOGO" || item.productType === "NECKTIE"
            ? null
            : productAvailability[
                `${item.productType}-${item.size}-${item.level}`
              ] || 0;

        const isAvailable =
          item.productType === "LOGO" || item.productType === "NECKTIE"
            ? true
            : item.quantity <= availableQuantity;

        return (
          <div
            key={index}
            className={`flex items-center gap-2 ${
              isAvailable === null
                ? ""
                : isAvailable
                ? "text-green-600 text-xs"
                : "text-red-600 text-xs"
            }`}
          >
            {item.productType === "LOGO" || item.productType === "NECKTIE" ? (
              <>
                <span className="text-xs">{item.productType}</span> -{" "}
                <span className="text-xs font-medium">{item.quantity}</span>
              </>
            ) : (
              <>
                <span className="text-xs font-medium">{item.level}:</span>{" "}
                <span className="text-xs">{item.productType}</span> -{" "}
                <span className="text-xs">{item.size}</span> -{" "}
                <span className="text-xs font-medium">{item.quantity}</span> (
                {isAvailable ? "Available" : "Not Available"})
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

OrderItems.propTypes = {
  orderItems: PropTypes.array.isRequired,
  finishedProducts: PropTypes.array.isRequired,
};

const OrderDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const selectedOrder = location.state?.selectedOrder;
  const navigate = useNavigate();

  const totalPrice = selectedOrder?.orderItems.reduce(
    (acc, item) => acc + parseFloat(item.totalPrice || 0),
    0
  );

  const totalAmountPaid = selectedOrder?.receipts.reduce(
    (acc, receipt) => acc + parseFloat(receipt.amount || 0),
    0
  );

  const currentBalance = totalPrice - totalAmountPaid;

  useEffect(() => {
    const fetchFinishedProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/v1/finished-product/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const data = res.data;
        setData(data.finishedProducts);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch finished products.");
        setLoading(false);
      }
    };

    fetchFinishedProduct();
  }, []);

  return (
    <div className="w-full h-screen p-6 overflow-auto">
      <Helmet>
        <title>MarSUKAT | Order Details</title>
        <meta
          name="description"
          content="View details of the selected order."
        />
      </Helmet>

      <Typography.Title level={2} className="text-black dark:text-white mb-6">
        Order Details
      </Typography.Title>

      {loading ? (
        <div className="shadow-lg rounded-lg p-5 mt-10 border-2 border-gray-600">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
            <div className="flex flex-col lg:w-1/2">
              <Skeleton className="w-full h-[400px] rounded-lg shadow-md" />
            </div>

            <div className="flex flex-col lg:w-1/2">
              <div className="mb-4">
                <div className="text-xl font-bold flex flex-row gap-2">
                  <Skeleton className="h-6 w-[150px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
                <Skeleton className="h-4 w-[200px] mt-2" />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[160px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              </div>

              <div className="flex justify-end mt-10">
                <Skeleton className="h-10 w-[100px] rounded-md" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Card className="shadow-lg rounded-lg p-5 mt-10">
          {selectedOrder ? (
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
              <div className="flex flex-col lg:w-1/2">
                <CardHeader className="mb-4">
                  <CardTitle className="text-xl font-bold">
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-bold flex flex-row gap-2">
                    <h3 className="text-xl">{selectedOrder.studentName}</h3>
                  </div>
                  <div className="mt-2 flex flex-col gap-3">
                    <h6 className="text-sm font-semibold">
                      Student Number:{" "}
                      <span className="font-normal text-xs ml-4">
                        {selectedOrder.studentNumber}
                      </span>
                    </h6>
                    <h6 className="text-sm font-semibold">
                      Year Level:{" "}
                      <span className="font-normal text-xs ml-4">
                        {selectedOrder.level}
                      </span>
                    </h6>
                    <h6 className="text-sm font-semibold">
                      Department:{" "}
                      <span className="font-normal text-xs ml-4">
                        {selectedOrder.department}
                      </span>
                    </h6>
                  </div>
                </CardContent>
              </div>

              <div className="flex flex-col lg:w-1/2">
                <CardHeader className="mb-4">
                  <CardTitle className="text-xl font-bold">
                    Order Details
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h6 className="text-sm font-semibold">Orders:</h6>
                    <OrderItems
                      orderItems={selectedOrder.orderItems}
                      finishedProducts={data}
                    />
                  </div>

                  <div className="space-y-4">
                    <h6 className="text-sm font-semibold">
                      Total Price:{" "}
                      <span className="font-normal text-xs">
                        ₱{totalPrice?.toFixed(2)}
                      </span>
                    </h6>
                    <h6 className="text-sm font-semibold flex gap-3 items-center">
                      Current Balance:{" "}
                      <span className="font-normal text-xs">
                        {currentBalance === 0 ? (
                          <StatusBadge status="Paid" />
                        ) : currentBalance > 0 ? (
                          `₱${currentBalance.toFixed(2)}`
                        ) : (
                          <StatusBadge status="downPayment" />
                        )}
                      </span>
                    </h6>
                    <h6 className="text-sm font-semibold">
                      Schedule:{" "}
                      <span className="font-normal text-xs">
                        {selectedOrder.schedule
                          ? new Date(selectedOrder.schedule).toDateString()
                          : "Not yet scheduled"}
                      </span>
                    </h6>
                    <h6 className="text-sm font-semibold flex items-center gap-2">
                      <span>Status:</span>
                      <StatusBadge status={selectedOrder.status} />
                    </h6>
                  </div>
                </CardContent>

                <div className="flex justify-end mt-10">
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Typography.Text className="text-gray-600">
              No order details available.
            </Typography.Text>
          )}
        </Card>
      )}

      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default OrderDetails;
