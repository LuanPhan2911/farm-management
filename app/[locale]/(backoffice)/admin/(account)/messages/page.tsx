import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatMessages } from "./_components/chat-messages";
import { getCurrentStaff } from "@/services/staffs";
import { ChatMessageCreateForm } from "./_components/chat-message-create-button";
import { notFound } from "next/navigation";
import { SocketIndicator } from "@/components/socket-indicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Link } from "@/navigation";

export async function generateMetadata() {
  const t = await getTranslations("messages.page");
  return {
    title: t("title"),
  };
}
const MessagesPage = async () => {
  const t = await getTranslations("messages.page");
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card className="min-h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {t("title")} <SocketIndicator />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Manage messages</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={"/admin/messages/files"}>Uploaded files</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ChatMessages
            chatId={"all"}
            apiUrl="/api/messages"
            currentStaff={currentStaff}
            paramKey="orgId"
            paramValue={"all"}
            socketUrl="/api/socket/messages"
            socketQuery={{
              orgId: "all",
            }}
          />
          <ChatMessageCreateForm
            socketUrl="/api/socket/messages"
            socketQuery={{
              orgId: "all",
            }}
            fileQuery={{
              isPublic: true,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesPage;
