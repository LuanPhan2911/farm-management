"use client";

import * as React from "react";

import { useMediaQuery } from "react-responsive";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsClient } from "usehooks-ts";
import { Link } from "@/navigation";
import { BreadcrumbItemWithSeparator } from "@/components/breadscrumb-item-with-separator";
import { useBreadCrumb } from "@/hooks/use-breadcrumb";
import { useMedia } from "@/hooks/use-media";
import { useConfirmWhenChangeRoute } from "@/stores/use-confirm-when-change-route";
import { truncateString } from "@/lib/utils";
import { Hint } from "@/components/hint";

const ITEMS_TO_DISPLAY = 3;

export const BreadcrumbResponsive = () => {
  const [open, setOpen] = React.useState(false);
  const { isDesktop } = useMedia();

  const { breadcrumbs: items } = useBreadCrumb();

  const isClient = useIsClient();
  if (!isClient) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.length >= ITEMS_TO_DISPLAY && (
          <BreadcrumbItemWithSeparator
            label={truncateString(items[0].label, 25)}
            href={items[0].href}
          />
        )}
        {items.length > ITEMS_TO_DISPLAY && isDesktop && (
          <>
            <BreadcrumbItem>
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger
                  className="flex items-center gap-1"
                  aria-label="Toggle menu"
                >
                  <BreadcrumbEllipsis className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {items.slice(1, -2).map((item, index) => (
                    <DropdownMenuItem key={index}>
                      <Hint
                        asChild
                        label={item.label}
                        disabled={item.label.length < 25}
                      >
                        <Link href={item.href ? item.href : "#"}>
                          {truncateString(item.label, 25)}
                        </Link>
                      </Hint>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {items.slice(-ITEMS_TO_DISPLAY + 1).map((item, index) => (
          <BreadcrumbItemWithSeparator
            isLast={items.slice(-ITEMS_TO_DISPLAY + 1).length - 1 === index}
            label={item.label}
            href={item.href}
            key={index}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
