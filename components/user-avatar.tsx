import { cn } from "@/lib/utils";

import { cva, VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const avatarSizes = cva("", {
  variants: {
    size: {
      default: "h-10 w-10",
      lg: "h-14 w-14",
      sm: "h-9 w-9",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
interface UserAvatarProps
  extends VariantProps<typeof avatarSizes>,
    React.HTMLAttributes<HTMLImageElement> {
  src: string | undefined;
}
export const UserAvatar = ({
  src,
  size,
  className,
  ...props
}: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage src={src} className={cn(avatarSizes({ size }))} {...props} />
      <AvatarFallback className="bg-blue-300">CN</AvatarFallback>
    </Avatar>
  );
};
