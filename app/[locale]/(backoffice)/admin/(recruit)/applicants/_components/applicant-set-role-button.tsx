"use client";

import { editRole } from "@/actions/applicant";
import { DynamicDialog } from "@/components/dynamic-dialog";
import { SelectOptions } from "@/components/select-options";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApplicantUpdateRoleSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { Applicant, StaffRole } from "@prisma/client";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ApplicantSetRoleButtonProps {
  data: Applicant;
  label: string;
}
export const ApplicantSetRoleButton = ({
  data,
  label,
}: ApplicantSetRoleButtonProps) => {
  const { onOpen } = useDialog();

  return (
    <Button
      className="w-full"
      onClick={() =>
        onOpen("applicant.setRole", {
          applicant: data,
        })
      }
    >
      <Edit className="h-6 w-6 mr-2" />
      {label}
    </Button>
  );
};
export const ApplicantSetRoleDialog = () => {
  const { isOpen, data, type, onClose } = useDialog();

  const isOpenDialog = isOpen && type === "applicant.setRole";
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("applicants");
  const tSchema = useTranslations("applicants.schema");
  const formSchema = ApplicantUpdateRoleSchema(tSchema);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "farmer",
    },
  });
  useEffect(() => {
    if (data.applicant) {
      form.setValue("name", data.applicant.name);
    }
  }, [form, data]);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!data.applicant?.id) {
      return;
    }
    const applicantId = data.applicant.id;
    startTransition(() => {
      editRole(values, applicantId)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(t("status.failure.editRole"));
        })
        .finally(() => {
          onClose();
        });
    });
  };

  const options: { label: string; option: StaffRole }[] = [
    {
      label: "Admin",
      option: "admin",
    },
    {
      label: "Farmer",
      option: "farmer",
    },
  ];

  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={t("form.setRole.title")}
      description={t("form.setRole.description")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("name.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("name.placeholder")}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("role.label")}</FormLabel>
                <FormControl>
                  <SelectOptions
                    label="Select role"
                    options={options}
                    onChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-x-2 justify-end">
            <Button variant="secondary" onClick={onClose} type="button">
              Close
            </Button>
            <Button disabled={isPending} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </DynamicDialog>
  );
};
