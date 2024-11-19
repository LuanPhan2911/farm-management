"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OTPCodeSchema } from "@/schemas";
import { useDialogConfirmCode } from "@/stores/use-dialog-confirm-code";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect } from "react";

export const DynamicDialogOTP = () => {
  const { onClose, isOpen, data, isPending } = useDialogConfirmCode();
  const tSchema = useTranslations("users.schema");

  const formSchema = OTPCodeSchema(tSchema);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    if (data !== null) {
      form.setValue("confirmCode", data.confirmCode);
    }
  }, [data, form]);

  if (!data) {
    return null;
  }
  const { description, title, confirmCode, onConfirm } = data;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onConfirm();
      form.reset();
    } catch (error) {}
  };
  const codeValue = form.watch("code");
  const disabled = isPending || confirmCode !== codeValue;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-rose-500 font-semibold">
            {description}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type{" "}
                    <span className="text-rose-500 font-semibold">{`"${confirmCode}"`}</span>{" "}
                    to confirm
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("code.placeholder", {
                        value: confirmCode,
                      })}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-2 p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <Button
                variant={"outline"}
                disabled={isPending}
                onClick={onClose}
              >
                Close
              </Button>
              <Button variant={"cyan"} disabled={disabled} type="submit">
                {isPending ? "Processing" : "Confirm"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
