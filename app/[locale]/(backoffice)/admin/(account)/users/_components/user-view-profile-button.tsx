"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { User } from "@clerk/nextjs/server";
import { Search } from "lucide-react";
interface UserViewProfileButtonProps {
  data: User;
  label: string;
}
export const UserViewProfileButton = ({
  data,
  label,
}: UserViewProfileButtonProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/admin/users/detail/${data.id}`);
  };
  return (
    <Button
      className="w-full"
      onClick={handleClick}
      variant={"purple"}
      size={"sm"}
    >
      <Search className="h-6 w-6 mr-2" />
      {label}
    </Button>
  );
};
