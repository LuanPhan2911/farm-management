"use client";

import { create, createMany } from "@/actions/soil";
import { UnitsSelectWithQueryClient } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { DatePickerWithTime } from "@/components/form/date-picker-with-time";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { JSONEditorReact } from "@/components/vanila-json-editor";
import { parseUploadedJSONFile } from "@/lib/utils";
import { SoilSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitType } from "@prisma/client";
import { Plus, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Content, JSONContent, Mode, OnChangeStatus } from "vanilla-jsoneditor";
import { z } from "zod";

export const SoilCreateButton = () => {
  const tSchema = useTranslations("soils.schema");
  const t = useTranslations("soils");
  const formSchema = SoilSchema(tSchema);
  const [isPending, startTransition] = useTransition();

  const params = useParams<{
    fieldId: string;
  }>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldId: params.fieldId,
      createdAt: new Date(),
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            form.reset();

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
        <Button size={"sm"} variant={"success"}>
          <Plus className="h-4 w-4 mr-2" />{" "}
          <span className="text-sm font-semibold">
            {t("form.create.label")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{t("form.create.title")}</DialogTitle>
          <DialogDescription>{t("form.create.description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid lg:grid-col-2 gap-2">
              <FormField
                control={form.control}
                name="createdAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("createdAt.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <DatePickerWithTime
                          onChange={field.onChange}
                          value={field.value}
                          disabled={isPending}
                          placeholder={tSchema("createdAt.placeholder")}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ph"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("ph.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Input
                          placeholder={tSchema("ph.placeholder")}
                          value={field.value || undefined}
                          onChange={field.onChange}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-2">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="moisture.value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tSchema("moisture.label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={tSchema("moisture.placeholder")}
                            value={field.value || undefined}
                            onChange={field.onChange}
                            disabled={isPending}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="moisture.unitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("moisture.unitId.label")}</FormLabel>
                      <FormControl>
                        <UnitsSelectWithQueryClient
                          onChange={field.onChange}
                          placeholder={tSchema("moisture.unitId.placeholder")}
                          unitType={UnitType.PERCENT}
                          disabled={isPending}
                          className="w-full"
                          errorLabel={tSchema("moisture.unitId.error")}
                          notFound={tSchema("moisture.unitId.notFound")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="nutrientUnitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("nutrientUnitId.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <UnitsSelectWithQueryClient
                          onChange={field.onChange}
                          placeholder={tSchema("nutrientUnitId.placeholder")}
                          unitType={UnitType.NUTRIENT}
                          disabled={isPending}
                          className="w-full"
                          errorLabel={tSchema("nutrientUnitId.error")}
                          notFound={tSchema("nutrientUnitId.notFound")}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="nutrientNitrogen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("nutrientNitrogen.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Input
                          placeholder={tSchema("nutrientNitrogen.placeholder")}
                          value={field.value || undefined}
                          onChange={field.onChange}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nutrientPhosphorus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("nutrientPhosphorus.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Input
                          placeholder={tSchema(
                            "nutrientPhosphorus.placeholder"
                          )}
                          value={field.value || undefined}
                          onChange={field.onChange}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nutrientPotassium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("nutrientPotassium.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Input
                          placeholder={tSchema("nutrientPotassium.placeholder")}
                          value={field.value || undefined}
                          onChange={field.onChange}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("note.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <Textarea
                        value={field.value || undefined}
                        onChange={field.onChange}
                        disabled={isPending}
                        placeholder={tSchema("note.placeholder")}
                      />
                    </FormControl>
                  </div>
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

export const SoilCreateManyButton = () => {
  const params = useParams<{
    fieldId: string;
  }>();
  const initialContent = [
    {
      ph: 6.3,
      moisture: {
        unitId: "12f75b71-4cba-4dd1-a4c6-c45b88bdda72",
        value: 28,
      },
      nutrientNitrogen: 3.4,
      nutrientPhosphorus: 0.9,
      nutrientPotassium: 1.8,
      nutrientUnitId: "0c22be4a-8909-4e22-ae5e-13b69e5f0422",
      fieldId: params.fieldId || "f20cfcc8-eb88-4d23-9451-79e2c94c842e",
      createdAt: "2024-08-01T07:00:00",
    },
  ];
  const [jsonContent, setJsonContent] = useState<Content>({
    json: initialContent,
  });

  const handler = useCallback(
    (content: Content, previousContent: Content, status: OnChangeStatus) => {
      setJsonContent(content);
    },
    []
  );
  const uploadHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        parseUploadedJSONFile(file)
          .then(({ ok, data, message }) => {
            if (ok && !!data) {
              setJsonContent({
                json: data,
              });
            } else {
              toast.error(message);
            }
          })
          .catch((errorMessage: string) => {
            toast.error(errorMessage);
          });
      }
    },
    []
  );
  const [isPending, startTransition] = useTransition();
  const onSubmit = () => {
    startTransition(() => {
      const data = (jsonContent as JSONContent).json;
      createMany(params.fieldId, data)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            setJsonContent({
              json: initialContent,
            });
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(t("status.failure.createMany"));
        });
    });
  };
  const t = useTranslations("soils");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"purple"}>
          <Upload className="h-4 w-4 mr-2" /> {t("form.createMany.label")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{t("form.createMany.title")}</DialogTitle>
          <DialogDescription>
            {t("form.createMany.description")}
          </DialogDescription>
        </DialogHeader>

        <JSONEditorReact
          content={jsonContent}
          onChange={handler}
          mode={Mode.text}
          uploadHandler={uploadHandler}
          clearHandler={() => setJsonContent({ json: [] })}
          generateSample={() => setJsonContent({ json: initialContent })}
        />
        <DynamicDialogFooter disabled={isPending} />
      </DialogContent>
    </Dialog>
  );
};
