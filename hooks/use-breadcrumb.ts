import { usePathname } from "@/navigation";
import { BreadCrumb } from "@/types";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { validate as isValidUuid } from "uuid";

export const useBreadCrumb = () => {
  const paths = usePathname();
  const params = useParams();
  const t = useTranslations("route");
  const paramValues = Object.values(params).filter((item) => {
    return item !== "vi" && item !== "en";
  });
  const pathNames = paths
    .split("/")
    .filter(
      (path) => path && !isValidUuid(path) && !paramValues.includes(path)
    );
  const breadcrumbs: BreadCrumb[] = pathNames.map((pathname, index) => {
    const href = `/${pathNames.slice(0, index + 1).join("/")}`;
    const label = paramValues.indexOf(pathname) === -1 ? t(href) : pathname;
    if (pathNames.length - 1 === index) {
      return {
        label,
      };
    }

    return {
      label,
      href,
    };
  });
  return { breadcrumbs };
};
