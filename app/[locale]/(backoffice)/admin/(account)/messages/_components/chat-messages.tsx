"use client";
import { UserAvatar } from "@/components/user-avatar";
import { ChatParamKey, useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useRole } from "@/hooks/use-role";
import { MessageWithStaff } from "@/types";
import { File, Staff } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";
import { cn, isImage } from "@/lib/utils";
import {
  ChatMessageEditButton,
  ChatMessageEditForm,
} from "./chat-message-edit-button";
import { ChatMessageDeleteButton } from "./chat-message-delete-button";
import { ErrorButton } from "@/components/buttons/error-button";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadButtonWithUrl } from "@/components/buttons/download-button";
import { StaffMetadataRole } from "../../../_components/staff-metadata-role";
import { Separator } from "@/components/ui/separator";
import { useScrollToBottom } from "@/hooks/use-scroll-bottom";

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
  const t = useTranslations("messages.fetch");
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const bottomRef = useRef<HTMLInputElement>(null);

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
  // Track whether it's the first load
  const isInitialLoad = useRef(true);
  // Track whether a new message is added
  const isNewMessageAdded = useRef(false);

  useChatSocket({
    queryKey,
    addKey,
    updateKey,
    onNewMessage: () => {
      isNewMessageAdded.current = true;
    },
  });
  useScrollToBottom({
    bottomRef,
    data,
    isNewMessageAdded: isNewMessageAdded.current,
    isInitialLoad: isInitialLoad.current,
  });
  // Reset the new message flag after rendering
  useEffect(() => {
    isNewMessageAdded.current = false;
    if (data && isInitialLoad.current) {
      isInitialLoad.current = false; // Initial load has happened
    }
  }, [data]);

  if (status === "pending") {
    return (
      <div className="flex flex-col h-[300px] justify-center items-center">
        <Loader2 className="w-7 h-7 animate-spin my-4 " />
        <p className="text-xs">{t("notFound")}</p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col h-[300px] justify-center items-center">
        <ServerCrash className="w-7 h-7 my-4 " />
        <ErrorButton title={t("error")} refresh={refetch} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto gap-2">
      {!hasNextPage && <div className="flex-1"></div>}
      {!data?.pages?.[0]?.items?.length && <ChatWelcome title={t("welcome")} />}
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
        {data?.pages?.map(({ items }, i) => {
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
      <div ref={bottomRef}></div>
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

  const { deleted, staff, createdAt, updatedAt, files, content } = message;
  const isUpdated = createdAt !== updatedAt;
  const hasFiles = !!files && files.length > 0;

  const canDeleteMessage = !deleted && (isAdmin || isOwner);
  const canEditMessage = !deleted && isOwner;

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
            <StaffMetadataRole metadata={{ role: staff.role }} />
            <p className="text-xs text-muted-foreground">
              {relativeTime(createdAt)}
            </p>
          </div>
          <Separator className="my-2" />
          {hasFiles && <ChatItemFiles files={files} />}
          {!isEditing && (
            <p
              className={cn(
                "text-sm text-muted-foreground whitespace-pre-wrap pl-1",
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
          {isEditing && (
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
interface ChatItemFilesProps {
  files: File[];
}
const ChatItemFiles = ({ files }: ChatItemFilesProps) => {
  return (
    <Carousel className="w-full max-w-md py-2">
      <CarouselContent className="-ml-1">
        {files &&
          files.length > 0 &&
          files.map((file, index) => {
            return (
              <CarouselItem className="pl-1 basis-1/3" key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center px-1 relative cursor-pointer">
                      {isImage(file.type) ? (
                        <Image src={file.url} alt="Preview" fill />
                      ) : (
                        <div className="h-full w-full flex flex-col justify-center">
                          <div className="text-sm text-center text-blue-400 font-semibold w-full line-clamp-1">
                            {file.type}
                          </div>
                          <div className="text-xs text-center text-muted-foreground w-full break-words">
                            {file.name}
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 hidden group-hover:block">
                        <DownloadButtonWithUrl
                          name={file.name}
                          url={file.url}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
      </CarouselContent>
    </Carousel>
  );
};
