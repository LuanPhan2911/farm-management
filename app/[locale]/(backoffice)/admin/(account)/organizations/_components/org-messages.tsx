"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Organization } from "@clerk/nextjs/server";
import { useTranslations } from "next-intl";
import { ChatMessages } from "../../messages/_components/chat-messages";
import { Staff } from "@prisma/client";
import { ChatMessageCreateForm } from "../../messages/_components/chat-message-create-button";
import { SocketIndicator } from "@/components/socket-indicator";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
interface OrgMessages {
  org: Organization;
  currentStaff: Staff;
}
export const OrgMessages = ({ org, currentStaff }: OrgMessages) => {
  const t = useTranslations("organizations.tabs");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {t("messages.title")}
          <SocketIndicator />
        </CardTitle>
        <CardDescription>{t("messages.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-start">
          <Link href={`/admin/organizations/detail/${org.id}/files`}>
            <Button variant={"blue"} size={"sm"}>
              Uploaded files
            </Button>
          </Link>
        </div>
        <Separator />
        <ChatMessages
          chatId={org.id}
          apiUrl="/api/messages"
          currentStaff={currentStaff}
          paramKey="orgId"
          paramValue={org.id}
          socketUrl="/api/socket/messages"
          socketQuery={{
            orgId: org.id,
          }}
        />
        <Separator />
        <ChatMessageCreateForm
          socketUrl="/api/socket/messages"
          socketQuery={{
            orgId: org.id,
          }}
          fileQuery={{
            isPublic: false,
            orgId: org.id,
          }}
        />
      </CardContent>
    </Card>
  );
};
