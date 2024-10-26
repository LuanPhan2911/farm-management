"use client";

import { create, createMany } from "@/actions/weather";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { SelectOptions } from "@/components/form/select-options";
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
import { WeatherSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitType, WeatherStatus } from "@prisma/client";
import { Plus, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const WeatherCreateButton = () => {
  const tSchema = useTranslations("weathers.schema");
  const t = useTranslations("weathers");
  const formSchema = WeatherSchema(tSchema);
  const [isPending, startTransition] = useTransition();

  const params = useParams<{
    fieldId: string;
  }>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldId: params!.fieldId,
      createdAt: new Date(),
      note: null,
    },
  });
  const [isOpen, setOpen] = useState(false);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
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
        <Button size={"sm"} variant={"success"}>
          <Plus className="h-4 w-4 mr-2" />{" "}
          <span className="text-sm font-semibold">
            {t("form.create.label")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{t("form.create.title")}</DialogTitle>
          <DialogDescription>{t("form.create.description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("status.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <SelectOptions
                          placeholder={tSchema("status.placeholder")}
                          onChange={field.onChange}
                          options={Object.keys(WeatherStatus).map((item) => {
                            return {
                              label: tSchema(`status.options.${item}`),
                              value: item,
                            };
                          })}
                          defaultValue={field.value}
                          disabled={isPending}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="temperature.value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tSchema("temperature.label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={tSchema("temperature.placeholder")}
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
                  name="temperature.unitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tSchema("temperature.unitId.label")}
                      </FormLabel>
                      <FormControl>
                        <UnitsSelect
                          onChange={field.onChange}
                          placeholder={tSchema(
                            "temperature.unitId.placeholder"
                          )}
                          unitType={UnitType.TEMPERATURE}
                          disabled={isPending}
                          className="w-full"
                          error={tSchema("temperature.unitId.error")}
                          notFound={tSchema("temperature.unitId.notFound")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="humidity.value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tSchema("humidity.label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={tSchema("humidity.placeholder")}
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
                  name="humidity.unitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("humidity.unitId.label")}</FormLabel>
                      <FormControl>
                        <UnitsSelect
                          onChange={field.onChange}
                          placeholder={tSchema("humidity.unitId.placeholder")}
                          unitType={UnitType.PERCENT}
                          disabled={isPending}
                          className="w-full"
                          error={tSchema("humidity.unitId.error")}
                          notFound={tSchema("humidity.unitId.notFound")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="atmosphericPressure.value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {tSchema("atmosphericPressure.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={tSchema(
                              "atmosphericPressure.placeholder"
                            )}
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
                  name="atmosphericPressure.unitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tSchema("atmosphericPressure.unitId.label")}
                      </FormLabel>
                      <FormControl>
                        <UnitsSelect
                          onChange={field.onChange}
                          placeholder={tSchema(
                            "atmosphericPressure.unitId.placeholder"
                          )}
                          unitType={UnitType.ATMOSPHERICPRESSURE}
                          disabled={isPending}
                          className="w-full"
                          error={tSchema("atmosphericPressure.unitId.error")}
                          notFound={tSchema(
                            "atmosphericPressure.unitId.notFound"
                          )}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="rainfall.value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tSchema("rainfall.label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={tSchema("rainfall.placeholder")}
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
                  name="rainfall.unitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("rainfall.unitId.label")}</FormLabel>
                      <FormControl>
                        <UnitsSelect
                          onChange={field.onChange}
                          placeholder={tSchema("rainfall.unitId.placeholder")}
                          unitType={UnitType.RAINFALL}
                          disabled={isPending}
                          className="w-full"
                          error={tSchema("rainfall.unitId.error")}
                          notFound={tSchema("rainfall.unitId.notFound")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

import { useCallback, useState } from "react";

import {
  Mode,
  type Content,
  type OnChangeStatus,
  type JSONContent,
} from "vanilla-jsoneditor";
import { JSONEditorReact } from "@/components/vanila-json-editor";
import { parseUploadedJSONFile } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerWithTime } from "@/components/form/date-picker-with-time";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";

export const WeatherCreateManyButton = () => {
  const params = useParams<{
    fieldId: string;
  }>();
  const initialContent = [
    {
      temperature: {
        unitId: "982dc81e-26c5-41a8-a99e-232b53cf006d",
        value: 31.3,
      },
      humidity: {
        unitId: "12f75b71-4cba-4dd1-a4c6-c45b88bdda72",
        value: 51,
      },
      atmosphericPressure: {
        unitId: "e1205016-bb6c-45d9-8f81-efe2d25367ad",
        value: 913.7,
      },
      rainfall: {
        unitId: "57aa6fb3-f493-4246-b7fb-413fea12f5c5",
        value: 0,
      },
      status: "SUNNY",
      fieldId: params!.fieldId || "f20cfcc8-eb88-4d23-9451-79e2c94c842e",
      createdAt: "2024-08-01T12:00:00Z",
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
  const [isOpen, setOpen] = useState(false);
  const onSubmit = () => {
    startTransition(() => {
      const data = (jsonContent as JSONContent).json;
      createMany(params!.fieldId, data)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            setOpen(false);
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
  const t = useTranslations("weathers");
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
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
        <Button
          type="submit"
          disabled={isPending}
          variant={"blue"}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};
