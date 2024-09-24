import { usePathname, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";

export const useUpdateSearchParam = (key: string) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleChange = (value: string | undefined) => {
    const params = new URLSearchParams(searchParams);

    const currentValue = params.get(key);
    if (!value || currentValue === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.replace(`${pathname}?${params}`);
  };
  return { updateSearchParam: handleChange };
};
