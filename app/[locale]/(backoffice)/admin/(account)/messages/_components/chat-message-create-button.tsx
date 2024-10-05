"use client";

import { Button } from "@/components/ui/button";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { MessageSchema } from "@/schemas";
import { ActionResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import queryString from "query-string";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadFiles } from "@/components/form/upload-files";
import { useState } from "react";

interface ChatMessageCreateFormProps {
  socketUrl: string;
  socketQuery: Record<string, any>;
  fileQuery?: {
    isPublic: boolean;
  };
}
export const ChatMessageCreateForm = ({
  socketUrl,
  socketQuery,
  fileQuery,
}: ChatMessageCreateFormProps) => {
  const tSchema = useTranslations("messages.schema");
  const formSchema = MessageSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const url = queryString.stringifyUrl({
      url: socketUrl,
      query: socketQuery,
    });

    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });

      const data = (await res.json()) as ActionResponse;
      if (data.ok) {
        form.reset();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Internal error");
    }
  };
  // Custom onKeyDown handler for Textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent adding a new line
      form.handleSubmit(onSubmit)(); // Manually trigger form submit
    }
  };
  const isPending = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <div className="absolute bottom-2 left-2">
                      <ChatMessageCreateFilesButton
                        socketQuery={socketQuery}
                        socketUrl={socketUrl}
                        fileQuery={fileQuery}
                      />
                    </div>

                    <div className="absolute bottom-2 right-14">
                      <EmojiPicker
                        onChange={(emoji) =>
                          field.onChange(`${field.value} ${emoji}`)
                        }
                        disabled={isPending}
                      />
                    </div>
                    <div className="absolute bottom-2 right-4">
                      <Button
                        className="h-8 w-8"
                        variant={"blue"}
                        size={"icon"}
                        type="submit"
                        disabled={isPending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      disabled={isPending}
                      placeholder={tSchema("content.placeholder")}
                      {...field}
                      className="pl-14 pr-24 min-h-[56px] custom-scrollbar bg-zinc-200/90 dark:bg-zinc-700/75 border-none 
                    border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-400"
                      onKeyDown={handleKeyDown} // Attach custom keydown handler
                      autoFocus
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};

interface ChatMessageCreateFilesButtonProps {
  socketUrl: string;
  socketQuery: Record<string, any>;
  fileQuery?: {
    isPublic: boolean;
  };
}
export const ChatMessageCreateFilesButton = ({
  socketQuery,
  socketUrl,
  fileQuery,
}: ChatMessageCreateFilesButtonProps) => {
  const t = useTranslations("messages.form");
  const [isUploading, setUploading] = useState(false);
  const tSchema = useTranslations("messages.schema");
  const formSchema = MessageSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      fileIds: [],
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const url = queryString.stringifyUrl({
      url: socketUrl,
      query: socketQuery,
    });

    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });

      const data = (await res.json()) as ActionResponse;
      if (data.ok) {
        form.reset();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Internal error");
    }
  };
  // Custom onKeyDown handler for Textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent adding a new line
      form.handleSubmit(onSubmit)(); // Manually trigger form submit
    }
  };
  const isPending = form.formState.isSubmitting || isUploading;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"outline"} className="h-8 w-8">
          <Upload className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{t("createFiles.title")}</DialogTitle>
          <DialogDescription>{t("createFiles.description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="fileIds"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <UploadFiles
                        onUploadCompleted={(files) => {
                          field.onChange(files.map((file) => file.id));
                        }}
                        disabled={isPending}
                        setUploading={setUploading}
                        input={fileQuery}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>{tSchema("content.label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute  bottom-2 left-2">
                          <EmojiPicker
                            onChange={(emoji) =>
                              field.onChange(`${field.value} ${emoji}`)
                            }
                            disabled={isPending}
                          />
                        </div>
                        <div className="absolute bottom-2 right-4">
                          <Button
                            className="h-8 w-8"
                            variant={"blue"}
                            size={"icon"}
                            type="submit"
                            disabled={isPending}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          disabled={isPending}
                          placeholder={tSchema("content.placeholder")}
                          {...field}
                          className="pl-14 pr-16 min-h-[56px] custom-scrollbar bg-zinc-200/90 dark:bg-zinc-700/75 border-none 
                    border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-400"
                          onKeyDown={handleKeyDown} // Attach custom keydown handler
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
