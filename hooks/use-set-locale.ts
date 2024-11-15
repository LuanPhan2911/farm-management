import { useTransition } from "react";
import { usePathname, useRouter } from "@/navigation";
import { useParams } from "next/navigation";

export const useSetLocale = () => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const setLocale = (nextLocale: "vi" | "en") => {
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
  return { setLocale, isPending };
};
