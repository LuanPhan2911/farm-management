import { Badge } from "@/components/ui/badge";

interface StaffMetadataRoleProps {
  metadata: UserPublicMetadata;
}
export const StaffMetadataRole = ({ metadata }: StaffMetadataRoleProps) => {
  const role = metadata?.role;

  if (role === "superadmin") {
    return <Badge variant={"cyanToBlue"}>Superadmin</Badge>;
  }
  if (role === "admin") {
    return <Badge variant={"success"}>Admin</Badge>;
  }
  if (role === "farmer") {
    return <Badge variant={"info"}>Farmer</Badge>;
  }
  return <Badge variant={"default"}>Null</Badge>;
};
