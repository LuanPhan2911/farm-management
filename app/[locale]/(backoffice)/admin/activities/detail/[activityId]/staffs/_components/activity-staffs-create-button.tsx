"use client";

import { upsertAssigned } from "@/actions/activity";
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
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Staff } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ActivityStaffsCreateButtonProps {
  data: Staff[];
}
export const ActivityStaffsCreateButton = ({
  data,
}: ActivityStaffsCreateButtonProps) => {
  const { orgId } = useAuth();
  const params = useParams<{
    activityId: string;
  }>();
  const [isPending, startTransition] = useTransition();
  const tSchema = useTranslations("activities.schema");
  const formSchema = ActivityAssignedSchema(tSchema);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignedTo: !data.length ? undefined : data.map((item) => item.id),
      activityId: params?.activityId,
    },
  });
  useEffect(() => {
    form.setValue(
      "assignedTo",
      data.map((item) => item.id)
    );
  }, [data, form]);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-x-2">
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
                    disabled={isPending}
                    className="lg:w-[600px] w-[350px]"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} variant={"blue"}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
