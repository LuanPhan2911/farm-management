import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
const largeCardVariants = cva("", {
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
interface LargeCardProps extends VariantProps<typeof largeCardVariants> {
  icon: LucideIcon;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export const LargeCard = ({
  children,
  description,
  icon: Icon,
  className,
  variant,
}: LargeCardProps) => {
  return (
    <Card className={cn(largeCardVariants({ variant, className }))}>
      <CardHeader>
        <CardTitle className="flex justify-center">
          <Icon className="w-8 h-8" />
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        {children}
      </CardContent>
    </Card>
  );
};
