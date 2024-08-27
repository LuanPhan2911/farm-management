"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Staff } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createMember } from "@/actions/organization";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { OrgMemberRole } from "./org-member-role";
import { QueryProvider } from "@/components/providers/query-provider";
import { OrgMemberSelect } from "./org-member-select";

interface OrgMemberAddProps {
  data: Staff[];
}
export const OrgMemberAdd = ({ data }: OrgMemberAddProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const params = useParams<{
    orgId: string;
  }>();
  const t = useTranslations("organizations");
  const tSchema = useTranslations("organizations.schema");
  const formSchema = OrganizationMemberSchema(tSchema);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memberId: "",
      role: "org:member",
    },
  });
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
            closeRef.current?.click();
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(t("status.failure.create"));
        });
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"success"} size={"sm"}>
          {t("form.createMember.label")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> {t("form.createMember.title")}</DialogTitle>
          <DialogDescription>
            {" "}
            {t("form.createMember.description")}
          </DialogDescription>
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
                        <QueryProvider>
                          <OrgMemberSelect
                            defaultValue={field.value}
                            label={tSchema("memberId.label")}
                            notFound={tSchema("memberId.notFound")}
                            onChange={field.onChange}
                            disabled={isPending}
                          />
                        </QueryProvider>
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

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" ref={closeRef}>
                    Close
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
