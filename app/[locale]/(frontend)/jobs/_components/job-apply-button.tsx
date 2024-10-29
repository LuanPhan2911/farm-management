import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { ApplicantSchema } from "@/schemas";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "@/actions/applicant";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";

interface JobApplyButtonProps {
  jobId: string;
}
export const JobApplyButton = ({ jobId }: JobApplyButtonProps) => {
  const tSchema = useTranslations("applicants.schema");
  const t = useTranslations("applicants");
  const formSchema = ApplicantSchema(tSchema);
  const [isPending, startTransition] = useTransition();

  const { user } = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      email: "",
      phone: "",
    },
  });
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    if (user?.fullName) {
      form.setValue("name", user.fullName);
    }
    if (user?.emailAddresses.length) {
      form.setValue("email", user.emailAddresses[0].toString());
    }
  }, [user, form]);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values, jobId)
        .then(({ message }) => {
          form.reset();
          setOpen(false);
          toast.success(message);
        })
        .catch((error: Error) => {
          toast.error(error.message);
        });
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"blue"}>{t("form.apply.label")}</Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("form.apply.title")}</DialogTitle>
          <DialogDescription>{t("form.apply.description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("phone.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("phone.placeholder")}
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("address.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("address.placeholder")}
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
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("note.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={tSchema("note.placeholder")}
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
      </DialogContent>
    </Dialog>
  );
};
