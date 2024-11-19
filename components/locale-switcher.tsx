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
import { useSetLocale } from "@/hooks/use-set-locale";

export const LocaleSwitcher = () => {
  const local = useLocale();

  const t = useTranslations("localeSwitcher");
  const { isPending, setLocale } = useSetLocale();
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
        <DropdownMenuItem onClick={() => setLocale("en")}>
          <Image
            src={"/en.png"}
            alt="England"
            width={25}
            height={25}
            className="pr-2"
          />
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale("vi")}>
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
