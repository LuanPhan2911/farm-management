"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { OrganizationMembershipPublicUserData } from "@clerk/nextjs/server";

interface OrgMemberViewProfileButtonProps {
  data: OrganizationMembershipPublicUserData;
  label: string;
}
export const OrgMemberViewProfileButton = ({
  data,
  label,
}: OrgMemberViewProfileButtonProps) => {
  const router = useRouter();

  return (
    <Button
      variant={"edit"}
      size={"sm"}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/admin/staffs/detail/${data.userId}`);
      }}
      className="w-full"
    >
      {label}
    </Button>
  );
};
