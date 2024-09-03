import { UserAvatar } from "@/components/user-avatar";

interface StaffWithNameProps {
  imageUrl: string | undefined | null;
  name: string;
}
export const StaffWithName = ({ imageUrl, name }: StaffWithNameProps) => {
  return (
    <div className="flex items-center p-1">
      <UserAvatar
        src={imageUrl || undefined}
        size={"default"}
        className="rounded-full"
      />
      <div className="ml-4">
        <div className="text-sm font-medium leading-none text-start">
          {name}
        </div>
      </div>
    </div>
  );
};
