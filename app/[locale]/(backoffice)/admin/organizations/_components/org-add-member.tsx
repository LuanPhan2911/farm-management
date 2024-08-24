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
import { OrgSelectCreatedBy } from "./org-select-created-by";
import { createMember } from "@/actions/organization";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface OrgAddMemberProps {
  data: Staff[];
}
export const OrgAddMember = ({ data }: OrgAddMemberProps) => {
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
      email: "",
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("createdBy.label")}</FormLabel>
                    <FormControl>
                      <div className="block">
                        <OrgSelectCreatedBy
                          data={data}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isPending}
                          label={tSchema("createdBy.placeholder")}
                          notFound={tSchema("createdBy.notFound")}
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
