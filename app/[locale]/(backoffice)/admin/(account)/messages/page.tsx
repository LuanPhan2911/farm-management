import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatMessages } from "./_components/chat-messages";
import { getCurrentStaff } from "@/services/staffs";
import { ChatMessageCreateForm } from "./_components/chat-message-create-button";
import { notFound } from "next/navigation";
import { SocketIndicator } from "@/components/socket-indicator";

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
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesPage;
