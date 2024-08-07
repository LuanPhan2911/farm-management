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
            label={items[0].label}
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
                      <Link href={item.href ? item.href : "#"}>
                        {item.label}
                      </Link>
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
