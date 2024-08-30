"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFieldActiveTab } from "@/stores/use-tabs";
import { FieldWithUnit } from "@/types";
import { FieldInfo } from "./field-info";
import { FieldDanger } from "./field-danger";

interface FieldTabsProps {
  data: FieldWithUnit;
}
export const FieldTabs = ({ data }: FieldTabsProps) => {
  const { active, setActive } = useFieldActiveTab();
  return (
    <Tabs value={active} onValueChange={setActive}>
      <TabsList className="grid grid-cols-5">
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="crops">Crops</TabsTrigger>
        <TabsTrigger value="weather">Weather</TabsTrigger>
        <TabsTrigger value="soil">Soil</TabsTrigger>
        <TabsTrigger value="danger">Danger</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <FieldInfo data={data} />
      </TabsContent>
      <TabsContent value="crops">Crops</TabsContent>
      <TabsContent value="weather">Weather</TabsContent>
      <TabsContent value="soil">Soil</TabsContent>
      <TabsContent value="danger">
        <FieldDanger />
      </TabsContent>
    </Tabs>
  );
};
