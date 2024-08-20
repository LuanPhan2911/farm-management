import { Badge } from "@/components/ui/badge";
import { Roles } from "@/types";

interface UserMetadataRoleProps {
  metadata: UserPublicMetadata;
}
export const UserMetadataRole = ({ metadata }: UserMetadataRoleProps) => {
  const role = metadata?.role as Roles;

  if (role === "superadmin") {
    return <Badge variant={"cyanToBlue"}>Superadmin</Badge>;
  }
  if (role === "admin") {
    return <Badge variant={"success"}>Admin</Badge>;
  }
  if (role === "farmer") {
    return <Badge variant={"secondary"}>Farmer</Badge>;
  }
  return <Badge variant={"default"}>Null</Badge>;
};
