import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Monthly from "./Monthly";
import Yearly from "./Yearly";
import Weekly from "./Weekly";

const SalesSummary = () => {
  return (
    <div>
      <Card>
        <CardContent>
          <div className=" w-full">
            <Tabs defaultValue="weekly" className="mt-5">
              <div className="flex justify-between items-">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="weekly">
                <CardTitle className="mb-3">Weekly Sales</CardTitle>
                <Weekly />
              </TabsContent>
              <TabsContent value="monthly">
                <CardTitle className="mb-3">Monthly Sales</CardTitle>
                <Monthly />
              </TabsContent>
              <TabsContent value="yearly">
                <CardTitle className="mb-3">Yearly Sales</CardTitle>
                <Yearly />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesSummary;
