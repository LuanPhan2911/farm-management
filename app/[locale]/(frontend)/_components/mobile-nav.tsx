"use client";

import { Icons } from "@/components/icons";
import { MobileLink } from "@/components/mobile-link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/configs/siteConfig";
import { Menu } from "lucide-react";
import { useState } from "react";

export const MobileNav = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="success"
          size={"icon"}
          className="mr-2 px-0 md:hidden relative"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="pr-0">
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <Icons.logo className="mr-2 h-4 w-4" />
          <span className="font-bold">{siteConfig.name}</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <MobileLink href={"/"} onOpenChange={setOpen}>
              Home
            </MobileLink>
            <MobileLink href={"/"} onOpenChange={setOpen}>
              Products
            </MobileLink>
            <MobileLink href={"/jobs"} onOpenChange={setOpen}>
              Jobs
            </MobileLink>
            <MobileLink href={"/"} onOpenChange={setOpen}>
              New
            </MobileLink>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
