import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SmallCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}
export const SmallCard = ({
  icon: Icon,
  title,
  value,
  description,
}: SmallCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-bold">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-md font-semibold">{value}</div>
        {description && (
          <div className="text-md text-muted-foreground">{description}</div>
        )}
      </CardContent>
    </Card>
  );
};
