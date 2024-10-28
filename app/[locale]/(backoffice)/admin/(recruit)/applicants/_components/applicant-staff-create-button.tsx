"use client";
import { createApplicantStaff } from "@/actions/applicant";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
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
import { generateEmail, generatePassword } from "@/lib/utils";
import { StaffSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useTransition } from "react";

import { toast } from "sonner";
import { z } from "zod";
import { StaffSelectRole } from "../../../_components/staff-select-role";
import { useForm } from "react-hook-form";
import { ApplicantTable } from "@/types";
import { StaffRole } from "@prisma/client";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface ApplicantStaffCreateButtonProps {
  data: ApplicantTable;
  label: string;
}
export const ApplicantStaffCreateButton = ({
  data,
  label,
}: ApplicantStaffCreateButtonProps) => {
  const { onOpen } = useDialog();

  return (
    <Button
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
        onOpen("applicant.createStaff", {
          applicant: data,
        });
      }}
      variant={"success"}
    >
      <Edit className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};

export const ApplicantStaffCreateDialog = () => {
  const { isOpen, data, type, onClose } = useDialog();

  const isOpenDialog = isOpen && type === "applicant.createStaff";
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("applicants");
  const tSchema = useTranslations("staffs.schema");
  const formSchema = StaffSchema(tSchema);
  const { isAdmin } = useCurrentStaffRole();
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "farmer",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    if (data.applicant) {
      form.setValue("name", data.applicant.name);
      form.setValue("email", generateEmail(data.applicant.name));
      form.setValue("receiverEmail", data.applicant.email);
      form.setValue("password", generatePassword(8));
    }
  }, [form, data]);
  const watchName = form.watch("name");
  useEffect(() => {
    if (watchName) {
      form.setValue("email", generateEmail(watchName));
    }
  }, [watchName, form]);
  const refreshPassword = () => {
    form.setValue("password", generatePassword(8));
  };
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!data.applicant?.id) {
      return;
    }
    const applicantId = data.applicant.id;
    startTransition(() => {
      createApplicantStaff(values, applicantId)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            form.reset();
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(t("status.failure.createStaff"));
        })
        .finally(() => {
          onClose();
        });
    });
  };
  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={t("form.createStaff.title")}
      description={t("form.createStaff.description")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("name.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("name.placeholder")}
                    value={field.value || undefined}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("email.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("email.placeholder")}
                    value={field.value || undefined}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("password.label")}</FormLabel>
                <div className="flex gap-x-2">
                  <FormControl>
                    <Input
                      placeholder={tSchema("password.placeholder")}
                      value={field.value || undefined}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <Button
                    size={"sm"}
                    onClick={refreshPassword}
                    type="button"
                    disabled={isPending}
                    variant={"outline"}
                  >
                    <RefreshCcw />
                  </Button>
                </div>

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
                  <StaffSelectRole
                    defaultValue={field.value || undefined}
                    onChange={field.onChange}
                    placeholder={tSchema("role.placeholder")}
                    disabledValues={[
                      ...(isAdmin
                        ? [StaffRole.superadmin, StaffRole.admin]
                        : []),
                    ]}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="receiverEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("receiverEmail.label")}</FormLabel>

                <FormControl>
                  <Input
                    placeholder={tSchema("receiverEmail.placeholder")}
                    value={field.value || undefined}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <DynamicDialogFooter disabled={isPending} />
        </form>
      </Form>
    </DynamicDialog>
  );
};
