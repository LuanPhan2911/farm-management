"use client";

import { upsertAssigned } from "@/actions/activity-assigned";
import { StaffsSelectMultiple } from "@/app/[locale]/(backoffice)/admin/_components/staffs-select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ActivityAssignedSchema } from "@/schemas";
import { ManagePermission, StaffWithSalaryAndActivity } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ActivityStaffsCreateButtonProps extends ManagePermission {
  data: StaffWithSalaryAndActivity[];
}
export const ActivityStaffsCreateButton = ({
  data,
  canCreate,
}: ActivityStaffsCreateButtonProps) => {
  const { orgId } = useAuth();
  const params = useParams<{
    activityId: string;
  }>();
  const [isPending, startTransition] = useTransition();
  const tSchema = useTranslations("activityAssigned.schema");
  const formSchema = ActivityAssignedSchema(tSchema);
  const assignedStaffs = data.map((item) => item.staff);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignedTo: assignedStaffs.map((item) => item.id),
      activityId: params?.activityId,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      upsertAssigned(values)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error("Internal error");
        });
    });
  };

  const disabled = isPending || !canCreate;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex lg:items-center items-end lg:flex-row flex-col gap-2">
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <StaffsSelectMultiple
                    orgId={orgId}
                    onChange={field.onChange}
                    defaultValue={field.value}
                    error={tSchema("assignedTo.error")}
                    placeholder={tSchema("assignedTo.placeholder")}
                    notFound={tSchema("assignedTo.notFound")}
                    disabled={disabled}
                    className="lg:w-[1024px] w-full"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={disabled} variant={"blue"}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
