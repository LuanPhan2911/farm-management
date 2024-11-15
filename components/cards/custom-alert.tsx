"use client";

import { VariantProps } from "class-variance-authority";
import { AlertCircle, LucideIcon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  alertVariants,
} from "../ui/alert";

interface CustomAlertProps extends VariantProps<typeof alertVariants> {
  title?: string;
  description: string;
  icon?: LucideIcon;
}
export const CustomAlert = ({
  description,
  icon,
  title,
  variant,
}: CustomAlertProps) => {
  const Icon = icon ? icon : AlertCircle;
  return (
    <Alert variant={variant}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
