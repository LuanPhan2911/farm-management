import { usePathname } from "@/navigation";
import { BreadCrumb } from "@/types";
import { useTranslations } from "next-intl";

export const useBreadCrumb = () => {
  const paths = usePathname();
  const t = useTranslations("route");
  const pathNames = paths.split("/").filter((path) => path);
  const breadcrumbs: BreadCrumb[] = pathNames.map((pathname, index) => {
    const href = `/${pathNames.slice(0, index + 1).join("/")}`;
    if (pathNames.length - 1 === index) {
      return {
        label: t(href),
      };
    }

    return {
      label: t(href),
      href,
    };
  });
  return { breadcrumbs };
};
