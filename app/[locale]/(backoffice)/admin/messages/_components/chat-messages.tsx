import { UserAvatar } from "@/components/user-avatar";
import { ChatParamKey, useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useRole } from "@/hooks/use-role";
import { MessageWithStaff } from "@/types";
import { Organization } from "@clerk/nextjs/server";
import { Staff } from "@prisma/client";
import { FileIcon, Loader2, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useRef, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ChatMessageEditButton,
  ChatMessageEditForm,
} from "./chat-message-edit-button";
import { ChatMessageDeleteButton } from "./chat-message-delete-button";
import { ErrorButton } from "@/components/buttons/error-button";
import { Button } from "@/components/ui/button";
import { useChatScroll } from "@/hooks/use-chat-scroll";

interface ChatMessagesProps {
  chatId: string;
  currentStaff: Staff;
  apiUrl: string;
  paramKey: ChatParamKey;
  paramValue: string;
  socketUrl: string;
  socketQuery: Record<string, any>;
}
export const ChatMessages = ({
  chatId,
  currentStaff,
  apiUrl,
  paramKey,
  paramValue,
  socketUrl,
  socketQuery,
}: ChatMessagesProps) => {
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const t = useTranslations("messages.fetch");
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useChatQuery({
    apiUrl,
    paramKey,
    paramValue,
    queryKey,
  });
  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    bottomRef,
    chatRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });
  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="w-7 h-7 animate-spin my-4 " />
        <p className="text-xs">{t("notFound")}</p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="w-7 h-7 my-4 " />
        <ErrorButton title={t("error")} refresh={refetch} />
      </div>
    );
  }

  return (
    <div
      ref={chatRef}
      className="flex-1 flex flex-col py-4 overflow-y-auto gap-2"
    >
      {!hasNextPage && <div className="flex-1"></div>}
      {!data?.pages?.[0]?.items.length && <ChatWelcome title={t("welcome")} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 animate-spin py-4" />
          ) : (
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant={"outline-blue"}
              size={"sm"}
            >
              {t("loadPrevious")}
            </Button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map(({ items, nextCursor }, i) => {
          return (
            <Fragment key={i}>
              {items?.map((message: MessageWithStaff) => {
                return (
                  <ChatItem
                    key={message.id}
                    message={message}
                    socketUrl={socketUrl}
                    socketQuery={socketQuery}
                    currentStaff={currentStaff}
                  />
                );
              })}
            </Fragment>
          );
        })}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

const ChatWelcome = ({ title }: { title: string }) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      <p className="text-md font-semibold text-muted-foreground">{title}</p>
    </div>
  );
};
interface ChatItemProps {
  message: MessageWithStaff;
  socketQuery: Record<string, any>;
  socketUrl: string;
  currentStaff: Staff;
}
const ChatItem = ({
  message,
  socketUrl,
  socketQuery,
  currentStaff,
}: ChatItemProps) => {
  const { isAdmin } = useRole(message.staff.role);
  const { relativeTime } = useFormatter();

  const [isEditing, setEditing] = useState(false);

  const isOwner = currentStaff.id === message.staffId;

  const { deleted, staff, createdAt, updatedAt, file, content } = message;
  const isUpdated = createdAt !== updatedAt;
  const hasFile = !!message.file;

  const canDeleteMessage = !deleted && (isAdmin || isOwner);
  const canEditMessage = !deleted && isOwner;

  const fileType = hasFile && file?.url?.split(".").pop();
  const isPdf = fileType === "pdf" && file?.url;
  const isImage = !isPdf && file?.url;

  return (
    <div
      className="relative group flex items-center 
  hover:bg-black/5 p-4 transition w-full rounded-lg"
    >
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar
            src={staff.imageUrl || undefined}
            size={"default"}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <p className="font-semibold text-sm hover:underline cursor-pointer">
              {staff.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {relativeTime(createdAt)}
            </p>
          </div>
          {isImage && (
            <a
              href={file.url}
              target="_blank"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex 
            items-center bg-secondary h-48 w-48"
            >
              <Image src={file.url} fill alt={content} />
            </a>
          )}
          {isPdf && (
            <div className="relative flex items-center p-5 rounded-md">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={file.url}
                target="_blank"
                className="ml-2 text-sm 
              text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF file
              </a>
            </div>
          )}
          {!file?.url && !isEditing && (
            <p
              className={cn(
                "text-sm text-muted-foreground whitespace-pre-wrap",
                deleted && "italic mt-1"
              )}
            >
              {deleted ? "This message is deleted" : content}
              {isUpdated && !deleted && (
                <span className="text-xs text-muted-foreground mx-2">
                  (Edited)
                </span>
              )}
            </p>
          )}
          {!file?.url && isEditing && (
            <ChatMessageEditForm
              setEditing={setEditing}
              message={message}
              socketQuery={socketQuery}
              socketUrl={socketUrl}
            />
          )}
        </div>
        {canDeleteMessage && !isEditing && (
          <div
            className="hidden group-hover:flex items-center 
          gap-x-2 absolute p-1 top-2 right-5 
          bg-white dark:bg-zinc-800
          border rounded-md"
          >
            {canEditMessage && (
              <ChatMessageEditButton setEditing={setEditing} />
            )}
            {canDeleteMessage && (
              <ChatMessageDeleteButton
                message={message}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
