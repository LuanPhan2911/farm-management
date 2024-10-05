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
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Manage messages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/admin/organizations/detail/${org.id}/files`}>
                  Uploaded files
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
        <ChatMessageCreateForm
          socketUrl="/api/socket/messages"
          socketQuery={{
            orgId: org.id,
          }}
        />
      </CardContent>
    </Card>
  );
};
