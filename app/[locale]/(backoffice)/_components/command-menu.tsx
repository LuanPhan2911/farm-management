"use client";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { useSetLocale } from "@/hooks/use-set-locale";
import { useSidebarItem } from "@/hooks/use-sidebar-item";
import { cn } from "@/lib/utils";
import { useRouter } from "@/navigation";
import { DialogProps } from "@radix-ui/react-dialog";
import { Circle, File, Laptop, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export const CommandMenu = (props: DialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();
  const { setLocale } = useSetLocale();
  const t = useTranslations("command-menu");
  const { isOnlyAdmin } = useCurrentStaffRole();
  const { adminSidebar, farmerSidebar } = useSidebarItem();

  const sidebar = isOnlyAdmin ? adminSidebar : farmerSidebar;
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);
  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-10 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">{t("title")}</span>
        <span className="inline-flex lg:hidden">{t("label")}</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.5rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("placeholder")} />
        <CommandList>
          <CommandEmpty>{t("notFound")}</CommandEmpty>
          <CommandGroup heading={t("suggestionsGroup")}>
            {sidebar
              .filter((group) => group.items.length === 0)
              .map((item) => {
                return (
                  <CommandItem
                    key={item.href}
                    value={item.title}
                    onSelect={() => {
                      runCommand(() => router.push(item.href as string));
                    }}
                  >
                    <File />
                    {item.title}
                  </CommandItem>
                );
              })}
          </CommandGroup>
          {sidebar
            .filter((group) => group.items.length != 0)
            .map((group) => {
              return (
                <CommandGroup heading={group.title} key={group.title}>
                  {group.items.map((item) => {
                    return (
                      <CommandItem
                        key={item.href}
                        value={item.title}
                        onSelect={() => {
                          runCommand(() => router.push(item.href as string));
                        }}
                      >
                        <Circle />
                        {item.title}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}

          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop />
              System
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Language">
            <CommandItem onSelect={() => runCommand(() => setLocale("en"))}>
              <Image
                src={"/en.png"}
                alt="England"
                width={25}
                height={25}
                className="pr-2"
              />
              English
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setLocale("vi"))}>
              <Image
                src={"/vi.png"}
                alt="Việt Nam"
                width={25}
                height={25}
                className="pr-2"
              />
              Tiếng việt
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
