"use client";

import { Icons } from "@/components/icons";
import { MobileLink } from "@/components/mobile-link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/configs/siteConfig";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "@/navigation";
import { ArrowLeft, Menu } from "lucide-react";
import { useState } from "react";

export const MobileNav = () => {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-x-3 px-0 md:hidden">
      <Button
        size={"icon"}
        variant={"purple"}
        onClick={() => {
          router.back();
        }}
        className={cn(pathname === "/" && "hidden")}
      >
        <ArrowLeft />
      </Button>
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="success" size={"icon"} className="relative">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="pr-0">
          <SheetHeader>
            <SheetTitle>
              <MobileLink
                href="/"
                className="flex items-center"
                onOpenChange={setOpen}
              >
                <Icons.logo width={20} height={20} />
                <span className="font-bold">{siteConfig.name}</span>
              </MobileLink>
            </SheetTitle>
          </SheetHeader>

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
    </div>
  );
};
