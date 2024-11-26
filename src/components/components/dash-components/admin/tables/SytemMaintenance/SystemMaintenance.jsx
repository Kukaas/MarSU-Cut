import CustomPageTitle from "@/components/components/custom-components/CustomPageTitle";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Sizes from "./Sizes";
import ProductTypes from "./ProductTypes";

const SystemMaintenance = () => {
  return (
    <div className="w-full p-5 h-screen">
      <CustomPageTitle
        title="System Maintenance"
        description="Manage system maintenance"
      />
      <Tabs defaultValue="sizes" className="w-full mt-5">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="productTypes">Product Types</TabsTrigger>
          <TabsTrigger value="rawMaterialsTypes">
            Raw Materials Types
          </TabsTrigger>
          <TabsTrigger value="levels">Levels</TabsTrigger>
        </TabsList>
        <TabsContent value="sizes" className="mt-4">
          <div className="rounded-md border">
            <Sizes />
          </div>
        </TabsContent>
        <TabsContent value="productTypes" className="mt-4">
          <div className="rounded-md border">
            <ProductTypes />
          </div>
        </TabsContent>
        <TabsContent value="rawMaterialsTypes" className="mt-4">
          <div className="rounded-md border">
            <Sizes />
          </div>
        </TabsContent>
        <TabsContent value="levels" className="mt-4">
          <div className="rounded-md border">
            <Sizes />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemMaintenance;
