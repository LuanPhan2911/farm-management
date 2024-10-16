"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OrganizationMemberSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createMember } from "@/actions/organization";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { OrgMemberRole } from "./org-member-role";

import { StaffsSelect } from "../../../../_components/staffs-select";
import { Plus } from "lucide-react";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";

interface OrgMemberAddProps {}
export const OrgMemberAdd = ({}: OrgMemberAddProps) => {
  const params = useParams<{
    orgId: string;
  }>();
  const t = useTranslations("organizations");
  const tSchema = useTranslations("organizations.schema.member");
  const formSchema = OrganizationMemberSchema(tSchema);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "org:member",
    },
  });
  const [isOpen, setOpen] = useState(false);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const orgId = params?.orgId;
    if (!orgId) {
      return;
    }
    startTransition(() => {
      createMember(values, orgId)
        .then(({ message, ok }) => {
          if (ok) {
            form.reset();
            setOpen(false);
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
  const fetchMembers = async () => {
    const res = await fetch("/api/staffs/select");
    return await res.json();
  };
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"success"} size={"sm"}>
          <Plus className="mr-2" /> {t("form.createMember.label")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> {t("form.createMember.title")}</DialogTitle>
          <DialogDescription>
            {" "}
            {t("form.createMember.description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("memberId.label")}</FormLabel>
                  <FormControl>
                    <div className="block">
                      <StaffsSelect
                        queryKey={["staffs_select"]}
                        queryFn={fetchMembers}
                        defaultValue={field.value}
                        onChange={field.onChange}
                        errorLabel={tSchema("memberId.error")}
                        label={tSchema("memberId.placeholder")}
                        notFound={tSchema("memberId.notFound")}
                        disabled={isPending}
                      />
                    </div>
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
                    <div className="block">
                      <OrgMemberRole
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DynamicDialogFooter disabled={isPending} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
