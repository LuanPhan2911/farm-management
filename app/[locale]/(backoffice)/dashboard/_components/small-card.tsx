import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
const smallCardVariants = cva("", {
  variants: {
    variant: {
      default: "",
      destructive: "",
      warn: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
interface SmallCardProps extends VariantProps<typeof smallCardVariants> {
  title: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}
export const SmallCard = ({
  icon: Icon,
  title,
  value,
  variant,
  className,
}: SmallCardProps) => {
  return (
    <Card className={cn(smallCardVariants({ variant, className }))}>
      <CardContent className="p-3">
        <div className="grid lg:grid-cols-4 sm:grid-cols-1 gap-3">
          <div className="col-span-1 flex items-center justify-center">
            <Button size={"icon"} className="">
              <Icon className="w-8 h-8" />
            </Button>
          </div>
          <div className="lg:col-span-3 sm:col-span-1">
            <div className="flex flex-col items-center">
              <h2 className="text-muted-foreground">{title}</h2>
              <div className="text-2xl font-semibold">{value}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
