"use client";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSchema } from "@/schemas";
import { ActionResponse, MessageWithStaff } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Send, X } from "lucide-react";
import { useTranslations } from "next-intl";
import queryString from "query-string";
import { useCallback, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ChatMessageEditButtonProps {
  setEditing: (value: boolean) => void;
}
export const ChatMessageEditButton = ({
  setEditing,
}: ChatMessageEditButtonProps) => {
  return (
    <Hint label="Edit">
      <Edit
        onClick={() => setEditing(true)}
        className="w-5 h-5 cursor-pointer ml-auto 
                text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
      />
    </Hint>
  );
};
interface ChatMessageEditFormProps {
  message: MessageWithStaff;
  setEditing: (value: boolean) => void;
  socketUrl: string;
  socketQuery: Record<string, any>;
}
export const ChatMessageEditForm = ({
  message,
  setEditing,
  socketQuery,
  socketUrl,
}: ChatMessageEditFormProps) => {
  const tSchema = useTranslations("messages.schema");
  const formSchema = MessageSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  useEffect(() => {
    form.reset({
      content: message.content,
    });
  }, [message.content, form]);

  const onCloseEdit = useCallback(() => {
    setEditing(false);
    form.reset();
  }, [form, setEditing]);

  useEffect(() => {
    const cancel = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseEdit();
      }
    };

    document.addEventListener("keydown", cancel);
    return () => {
      document.removeEventListener("keydown", cancel);
    };
  }, [onCloseEdit]);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: `${socketUrl}/${message.id}`,
        query: socketQuery,
      });
      const res = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as ActionResponse;
      if (data.ok) {
        onCloseEdit();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Internal error");
    }
  };

  const isPending = form.formState.isSubmitting;
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent adding a new line
      form.handleSubmit(onSubmit)(); // Manually trigger form submit
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex items-center gap-x-2 pt-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => {
            return (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative w-full">
                    <Textarea
                      disabled={isPending}
                      placeholder={tSchema("content.placeholder")}
                      value={field.value}
                      onChange={field.onChange}
                      className="min-h-[56px]"
                      onKeyDown={handleKeyDown} // Attach custom keydown handler
                    />
                  </div>
                </FormControl>
              </FormItem>
            );
          }}
        ></FormField>

        <Hint label="Close" asChild>
          <Button
            disabled={isPending}
            variant={"outline"}
            size={"icon"}
            type="button"
            className="h-8 w-8"
            onClick={() => {
              onCloseEdit();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </Hint>
        <Hint label="Save" asChild>
          <Button
            disabled={isPending}
            variant={"blue"}
            size={"icon"}
            className="h-8 w-8"
            type="submit"
          >
            <Send className="h-4 w-4" />
          </Button>
        </Hint>
      </form>
      <span className="text-xs mt-1 text-muted-foreground">
        {tSchema("content.keyDown")}
      </span>
    </Form>
  );
};
