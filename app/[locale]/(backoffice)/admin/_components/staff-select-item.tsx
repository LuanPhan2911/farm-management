import { UserAvatar } from "@/components/user-avatar";
import { StaffMetadataRole } from "./staff-metadata-role";
import { StaffRole } from "@prisma/client";
interface StaffSelectItemProps {
  imageUrl: string | undefined;
  name: string;
  email: string;
  role: StaffRole;
}
export const StaffSelectItem = ({
  email,
  imageUrl,
  name,
  role,
}: StaffSelectItemProps) => {
  return (
    <div className="flex items-center p-1">
      <UserAvatar src={imageUrl} size={"default"} className="rounded-full" />
      <div className="ml-4">
        <div className="text-sm font-medium leading-none text-start">
          {name}
          <span className="ml-2">
            <StaffMetadataRole
              metadata={{
                role,
              }}
            />
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );
};
