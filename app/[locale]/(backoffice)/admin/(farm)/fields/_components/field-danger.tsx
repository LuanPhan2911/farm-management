"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDeleteButton } from "./field-delete-button";

export const FieldDanger = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete field</CardTitle>
        <CardDescription>
          This action is permanent and irreversible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldDeleteButton />
      </CardContent>
    </Card>
  );
};
