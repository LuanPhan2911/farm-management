"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { FileCreateButton } from "../../files/_components/file-create-button";

interface ChatMessageCreateFormProps {
  socketUrl: string;
  socketQuery: Record<string, any>;
}
export const ChatMessageCreateForm = ({
  socketUrl,
  socketQuery,
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
                      <Hint label="Upload file" asChild>
                        <FileCreateButton />
                      </Hint>
                    </div>

                    <div className="absolute bottom-2 right-14">
                      <Hint label={"Emoji"} asChild>
                        <EmojiPicker
                          onChange={(emoji) =>
                            field.onChange(`${field.value} ${emoji}`)
                          }
                          disabled={isPending}
                        />
                      </Hint>
                    </div>
                    <div className="absolute bottom-2 right-4">
                      <Hint label="Send" asChild>
                        <Button
                          className="h-8 w-8"
                          variant={"blue"}
                          size={"icon"}
                          type="submit"
                          disabled={isPending}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </Hint>
                    </div>
                    <Textarea
                      disabled={isPending}
                      placeholder={tSchema("content.placeholder")}
                      {...field}
                      className="pl-14 pr-24 min-h-[56px] custom-scrollbar bg-zinc-200/90 dark:bg-zinc-700/75 border-none 
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
  );
};
