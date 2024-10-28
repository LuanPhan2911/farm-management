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
import { useContext, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createMember } from "@/actions/organization";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { OrgMemberRoleSelect } from "../../../../_components/org-member-role";

import { Plus } from "lucide-react";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { OrgContext } from "../org-tabs";
import { OrgMembersSelect } from "../../../../_components/org-members-select";

interface OrgMemberCreateButtonProps {}
export const OrgMemberCreateButton = ({}: OrgMemberCreateButtonProps) => {
  const params = useParams<{
    orgId: string;
  }>()!;
  const t = useTranslations("organizations.form");
  const tSchema = useTranslations("organizations.schema.member");
  const formSchema = OrganizationMemberSchema(tSchema);
  const { canUpdate } = useContext(OrgContext);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "org:member",
    },
  });
  const [isOpen, setOpen] = useState(false);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      createMember(values, params.orgId)
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

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"success"} size={"sm"} disabled={!canUpdate}>
          <Plus className="mr-2" /> {t("createMember.label")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> {t("createMember.title")}</DialogTitle>
          <DialogDescription>{t("createMember.description")}</DialogDescription>
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
                    <OrgMembersSelect
                      query={{
                        orgId: params.orgId,
                      }}
                      defaultValue={field.value}
                      onChange={field.onChange}
                      error={tSchema("memberId.error")}
                      placeholder={tSchema("memberId.placeholder")}
                      notFound={tSchema("memberId.notFound")}
                      disabled={isPending || !canUpdate}
                      appearance={{
                        button: "lg:w-full h-12",
                        content: "lg:w-[350px]",
                      }}
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
                    <OrgMemberRoleSelect
                      onChange={field.onChange}
                      value={field.value}
                      disabled={isPending || !canUpdate}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DynamicDialogFooter disabled={isPending || !canUpdate} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
