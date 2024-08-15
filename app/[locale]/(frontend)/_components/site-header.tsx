"use client";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { MainNav } from "./main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";

export const SiteHeader = () => {
  const { isSignedIn } = useUser();
  return (
    <div
      className="sticky top-0 z-50 w-full border-border/40 bg-background/95 
    backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-2 mr-4 ">
          <nav className="flex items-center gap-x-2">
            <LocaleSwitcher />
            <ModeToggle />
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            ) : (
              <SignInButton>
                <Button variant={"success"}>SignIn</Button>
              </SignInButton>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};
