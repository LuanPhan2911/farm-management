import { Breadcrumb } from "@/types";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";

export const useBreadCrumb = () => {
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("route");

  // Ignore locale by slicing the first segment
  const pathSegments = pathname?.split("/").slice(2) ?? [];

  const breadcrumbs: Breadcrumb[] = [];
  let accumulatedPath = "";

  pathSegments.forEach((segment, index) => {
    const nextSegment =
      index + 1 < pathSegments.length && pathSegments[index + 1];
    const isIncludeParam =
      nextSegment && Object.values(params).includes(nextSegment);
    if (isIncludeParam) {
      // If the segment is a parameter, concatenate it with the previous path
      accumulatedPath += `/${segment}`;
    } else {
      accumulatedPath += `/${segment}`;
      const pathSegmentsWithoutParams = pathSegments
        .slice(0, index + 1)
        .filter((item) => !Object.values(params).includes(item));
      const label = t(`/${pathSegmentsWithoutParams.join("/")}`);
      breadcrumbs.push({
        href: pathSegments.length - 1 === index ? undefined : accumulatedPath,
        label,
      });
    }
  });

  return { breadcrumbs };
};
