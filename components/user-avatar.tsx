import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { cva, VariantProps } from "class-variance-authority";

const avatarSizes = cva("", {
  variants: {
    size: {
      default: "h-8 w-8",
      lg: "h-14 w-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  src: string | undefined;
}
export const UserAvatar = ({ src, size }: UserAvatarProps) => {
  return (
    <Avatar className={cn(avatarSizes({ size }))}>
      <AvatarImage src={src} />
      <AvatarFallback className="bg-blue-300 p-2 rounded-full">
        CN
      </AvatarFallback>
    </Avatar>
  );
};
