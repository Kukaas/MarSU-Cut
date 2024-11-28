import {
  Card,
  CardContent,
  CardDescription,
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateOrder from "@/components/components/forms/CreateOrder";
import { Toaster } from "sonner";
import Blouse from "../../../../../assets/blouse.png";
import Skirt from "../../../../../assets/skirt.png";
import SetFemale from "../../../../../assets/1SetFemale.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addNewOrder = () => {
    setIsDialogOpen(false);
    navigate("/dashboard?tab=orders");
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto">
      <div className="container mx-auto space-y-8">
        {/* Steps to Order Card */}
        <Card className="shadow-lg rounded-lg bg-card text-card-foreground">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold">
              Steps to Order Your School Uniform
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              {
                step: "1.",
                title: "Visit the Garments Section:",
                details: [
                  <>
                    Request a{" "}
                    <span className="font-bold">Downpayment Form</span> for the
                    school uniform.
                  </>,
                ],
              },
              {
                step: "2.",
                title: "Pay at the Cashier:",
                details: [
                  <>
                    Pay <span className="font-bold">₱500</span> and keep your
                    receipt.
                  </>,
                ],
              },
              {
                step: "3.",
                title: "Create an Appointment:",
                details: [
                  <>
                    Go to the <span className="font-bold">Appointments</span>{" "}
                    section.
                  </>,
                  <>
                    Click the{" "}
                    <span className="font-bold">&apos;Create&apos;</span> button
                    in the upper-right corner.
                  </>,
                ],
              },
              {
                step: "4.",
                title: "Fill in the Appointment Details:",
                details: [
                  <>
                    Enter the <span className="font-bold">information</span>{" "}
                    from your receipt into the form.
                  </>,
                ],
              },
              {
                step: "5.",
                title: "Submit Your Appointment:",
                details: [
                  <>
                    Wait for admin <span className="font-bold">approval.</span>
                  </>,
                ],
              },
            ].map((item, index) => (
              <div key={index} className="space-y-1">
                <h3 className="text-lg font-medium">
                  <span>{item.step}</span>{" "}
                  <span className="text-primary">{item.title}</span>
                </h3>
                <div className="ml-6 space-y-1">
                  {item.details.map((detail, idx) => (
                    <p key={idx} className="text-base text-muted-foreground">
                      <span className="mr-2">•</span>
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <p className="text-base text-muted-foreground">
              <span className="text-primary">Note:</span> The downpayment is
              non-refundable.
            </p>

            <div className="flex items-center justify-center w-full">
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button className="w-full">Create an Appointment Now</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-[450px] max-h-[550px] overflow-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Create an Appointment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Fill in the form below to create a new order.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <CreateOrder
                    addNewOrder={addNewOrder}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Finished Product Previews Card */}
        <Card className="shadow-lg rounded-lg bg-card text-card-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold">
              Finished Product Previews
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Take a look at our high-quality school uniforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { src: `${Skirt}`, label: "Skirt" },
                { src: `${Blouse}`, label: "Blouse" },
                { src: `${SetFemale}`, label: "Uniform Set (Female)" },
              ].map((product, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square shadow-md rounded-lg overflow-hidden hover:scale-105 transform transition-all duration-300"
                >
                  <img
                    src={`${product.src}?height=300&width=300`}
                    alt={`${product.label} preview`}
                    className="object-contain w-full h-full"
                  />
                  <span className="absolute bottom-2 left-2 bg-popover text-popover-foreground px-3 py-1 rounded text-sm font-medium shadow-md">
                    {product.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-center" richColors closeButton />
    </main>
  );
};

export default Dashboard;
