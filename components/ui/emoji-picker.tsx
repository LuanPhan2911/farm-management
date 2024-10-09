"use client";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";

interface EmojiPickerProps {
  onChange: (value: any) => void;
  disabled?: boolean;
}
export const EmojiPicker = ({ onChange, disabled }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          className="w-8 h-8"
          disabled={disabled}
          type="button"
        >
          <Smile className="dark:text-zinc-200 text-zinc-400 cursor-pointer" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
