"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { OrganizationMembershipPublicUserData } from "@clerk/nextjs/server";

interface OrgMemberViewProfileButtonProps {
  data: OrganizationMembershipPublicUserData;
}
export const OrgMemberViewProfileButton = ({
  data,
}: OrgMemberViewProfileButtonProps) => {
  const router = useRouter();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    router.push(`/admin/staffs/detail/${data.userId}`);
  };
  return (
    <Button
      variant={"edit"}
      size={"sm"}
      onClick={handleClick}
      className="w-full"
    >
      View profile
    </Button>
  );
};
