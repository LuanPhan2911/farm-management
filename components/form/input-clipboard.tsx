"use client";

import { ClipboardButton } from "../clipboard-button";
import { FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

interface InputClipboardProps {
  label: string;
  value: string;
}
export const InputClipboard = ({ label, value }: InputClipboardProps) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="flex gap-x-2">
        <Input value={value} disabled={true} />
        <ClipboardButton value={value} />
      </div>
    </FormItem>
  );
};
