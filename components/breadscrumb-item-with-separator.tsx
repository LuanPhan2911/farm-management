"use client";

import { Link } from "@/navigation";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
interface BreadcrumbItemWithSeparatorProps {
  href?: string;
  label: string;
  isLast?: boolean;
}
export const BreadcrumbItemWithSeparator = ({
  label,
  href,
  isLast,
}: BreadcrumbItemWithSeparatorProps) => {
  return (
    <>
      <BreadcrumbItem>
        {href ? (
          <BreadcrumbLink
            asChild
            className="max-w-20 truncate md:max-w-none font-semibold text-[16px] capitalize"
          >
            <Link href={href}>{label}</Link>
          </BreadcrumbLink>
        ) : (
          <BreadcrumbPage className="max-w-20 truncate md:max-w-none font-semibold text-[16px] capitalize">
            {label}
          </BreadcrumbPage>
        )}
      </BreadcrumbItem>
      {!isLast && <BreadcrumbSeparator />}
    </>
  );
};
