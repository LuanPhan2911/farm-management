"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/navigation";
import { useParams } from "next/navigation";

export const LocaleSwitcher = () => {
  const local = useLocale();

  const t = useTranslations("localeSwitcher");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const changeLocale = (nextLocale: "vi" | "en") => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"outline"} disabled={isPending}>
          <Image
            src={local === "en" ? "/en.png" : "/vi.png"}
            alt="Language"
            width={25}
            height={25}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t("title")}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => changeLocale("en")}>
          <Image
            src={"/en.png"}
            alt="England"
            width={25}
            height={25}
            className="pr-2"
          />
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLocale("vi")}>
          <Image
            src={"/vi.png"}
            alt="Việt Nam"
            width={25}
            height={25}
            className="pr-2"
          />
          Tiếng việt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
