"use client";
import { UserButton } from "@clerk/nextjs";

import { Button } from "./ui/button";

export const ProfileButton = () => {
  return (
    <Button size={"icon"} variant={"ghost"}>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
          },
        }}
      />
    </Button>
  );
};
