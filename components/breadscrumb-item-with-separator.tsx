"use client";

import { Link } from "@/navigation";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Hint } from "./hint";
import { truncateString } from "@/lib/utils";
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
      <Hint asChild label={label} disabled={label.length < 25}>
        <BreadcrumbItem>
          {href ? (
            <BreadcrumbLink
              asChild
              className="max-w-20 truncate md:max-w-none font-semibold text-[16px] capitalize"
            >
              <Link href={href}>{truncateString(label, 25)}</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage className="max-w-20 truncate md:max-w-none font-semibold text-[16px] capitalize">
              {truncateString(label, 25)}
            </BreadcrumbPage>
          )}
        </BreadcrumbItem>
      </Hint>
      {!isLast && <BreadcrumbSeparator />}
    </>
  );
};
