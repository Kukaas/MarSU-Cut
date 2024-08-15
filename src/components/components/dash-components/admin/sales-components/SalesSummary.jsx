import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Monthly from "./Monthly";
import Yearly from "./Yearly";
import Weekly from "./Weekly";
import { useState } from "react";

const SalesSummary = () => {
  const [tab, setTab] = useState("weekly");

  return (
    <div>
      <Card>
        <CardContent>
          <div className="w-full">
            <Tabs defaultValue="weekly" className="mt-5 flex flex-col">
              <div className="flex flex-col mb-4 lg:flex-row lg:justify-between md:flex-row md:justify-between">
                <div className="flex flex-col gap-3 mt-3">
                  {tab === "weekly" ? (
                    <div>
                      <CardTitle>Weekly Sales Summary</CardTitle>
                      <CardDescription>
                        View a summary of your weekly sales
                      </CardDescription>
                    </div>
                  ) : tab === "monthly" ? (
                    <div>
                      <CardTitle>Monthly Sales Summary</CardTitle>
                      <CardDescription>
                        View a summary of your monthly sales
                      </CardDescription>
                    </div>
                  ) : (
                    <div>
                      <CardTitle>Yearly Sales Summary</CardTitle>
                      <CardDescription>
                        View a summary of your yearly sales
                      </CardDescription>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <TabsList>
                    <TabsTrigger
                      value="weekly"
                      onClick={() => setTab("weekly")}
                    >
                      Weekly
                    </TabsTrigger>
                    <TabsTrigger
                      value="monthly"
                      onClick={() => setTab("monthly")}
                    >
                      Monthly
                    </TabsTrigger>
                    <TabsTrigger
                      value="yearly"
                      onClick={() => setTab("yearly")}
                    >
                      Yearly
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              <TabsContent value="weekly">
                <Weekly />
              </TabsContent>
              <TabsContent value="monthly">
                <Monthly />
              </TabsContent>
              <TabsContent value="yearly">
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
