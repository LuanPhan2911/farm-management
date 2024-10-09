"use client";

import { Hint } from "@/components/hint";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { ActionResponse, MessageWithStaff } from "@/types";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import queryString from "query-string";
import { toast } from "sonner";
interface ChatMessageDeleteButtonProps {
  message: MessageWithStaff;
  socketUrl: string;
  socketQuery: Record<string, any>;
}
export const ChatMessageDeleteButton = ({
  message,
  socketUrl,
  socketQuery,
}: ChatMessageDeleteButtonProps) => {
  const { onOpen, onClose, setPending } = useAlertDialog();
  const t = useTranslations("messages.form");
  const onConfirm = () => {
    setPending(true);
    const url = queryString.stringifyUrl({
      url: `${socketUrl}/${message.id}`,
      query: socketQuery,
    });
    fetch(url, {
      method: "DELETE",
    })
      .then((res) => {
        return res.json();
      })
      .then(({ message, ok }: ActionResponse) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .finally(() => {
        onClose();
      });
  };

  return (
    <Hint label="Delete">
      <Trash
        onClick={() =>
          onOpen({
            title: t("destroy.title"),
            description: t("destroy.description"),
            onConfirm,
          })
        }
        className="w-5 h-5 cursor-pointer ml-auto 
                text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
      />
    </Hint>
  );
};
