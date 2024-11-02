import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChatMessages } from "./_components/chat-messages";
import { ChatMessageCreateForm } from "./_components/chat-message-create-button";
import { SocketIndicator } from "@/components/socket-indicator";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DropdownMenuButton } from "@/components/buttons/dropdown-menu-button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export async function generateMetadata() {
  const t = await getTranslations("messages.page");
  return {
    title: t("title"),
  };
}
const MessagesPage = async () => {
  const t = await getTranslations("messages.page");

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card className="min-h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {t("title")} <SocketIndicator />
          </CardTitle>
          <CardDescription className="flex justify-end">
            <DropdownMenuButton>
              <DropdownMenuItem>
                <Link href={"/admin/messages/files"}>
                  <Button variant={"blue"} size={"sm"}>
                    Uploaded files
                  </Button>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuButton>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 mb-4">
          <ChatMessages
            chatId={"all"}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              orgId: "all",
            }}
          />
          <Separator />
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
