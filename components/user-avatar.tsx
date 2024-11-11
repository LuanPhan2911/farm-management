import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserAvatarProps extends React.HTMLAttributes<HTMLImageElement> {
  src: string | undefined;
}
export const UserAvatar = ({ src, className, ...props }: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage src={src} {...props} />
      <AvatarFallback className="bg-blue-300">CN</AvatarFallback>
    </Avatar>
  );
};
