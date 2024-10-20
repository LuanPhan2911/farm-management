import { Badge } from "@/components/ui/badge";
import { StaffRole } from "@prisma/client";

interface StaffMetadataRoleProps {
  metadata: UserPublicMetadata;
  isShort?: boolean;
}
export const StaffMetadataRole = ({
  metadata,
  isShort,
}: StaffMetadataRoleProps) => {
  const role = metadata?.role as StaffRole;
  const data = {
    [StaffRole.superadmin]: (
      <Badge variant={"cyanToBlue"}>
        {isShort ? StaffRole.superadmin[0] : StaffRole.superadmin}
      </Badge>
    ),
    [StaffRole.admin]: (
      <Badge variant={"success"}>
        {isShort ? StaffRole.admin[0] : StaffRole.admin}
      </Badge>
    ),
    [StaffRole.farmer]: (
      <Badge variant={"default"}>
        {isShort ? StaffRole.farmer[0] : StaffRole.farmer}
      </Badge>
    ),
  };

  return data[role];
};
