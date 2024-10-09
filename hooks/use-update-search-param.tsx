import { usePathname, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const useUpdateSearchParam = (
  key: string,
  defaultParam?: string | undefined
) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialParam = searchParams?.get(key);
  const router = useRouter();

  useEffect(() => {
    if (initialParam || !defaultParam) {
      return;
    }

    handleChange(defaultParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChange = (value: string | undefined) => {
    const params = new URLSearchParams(searchParams!);

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.replace(`${pathname}?${params}`);
  };
  return {
    updateSearchParam: handleChange,
    initialParam: initialParam ? initialParam : undefined,
  };
};

export const useUpdateSearchParams = <
  T extends Record<string, string | undefined>
>(
  keys: T
) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const updatedKeys: Record<keyof T, string | undefined> = { ...keys };
    // Loop through the keys to check for existing query parameters or apply defaults
    for (const key in updatedKeys) {
      const param = searchParams?.get(key);

      if (param) {
        // Use the value from the URL if it exists
        updatedKeys[key] = param;
      } else if (!updatedKeys[key]) {
        // If there's no value in the keys and no URL param, remove it
        delete updatedKeys[key];
      }
    }

    // Update the URL search parameters based on initial values or default
    handleChange(updatedKeys);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (values: Record<keyof T, string | undefined>) => {
    const params = new URLSearchParams(searchParams!);

    for (const key in values) {
      if (!values[key]) {
        params.delete(key);
      } else {
        params.set(key, values[key]!);
      }
    }

    router.replace(`${pathname}?${params}`);
  };

  // Get initial parameters, prioritizing query string values
  const getInitialParams = (): Record<keyof T, string | undefined> => {
    const updatedKeys: Record<keyof T, string | undefined> = { ...keys };

    for (const key in updatedKeys) {
      const param = searchParams?.get(key);
      updatedKeys[key] = param ?? updatedKeys[key] ?? undefined;
    }

    return updatedKeys;
  };

  return {
    updateSearchParams: handleChange,
    initialParams: getInitialParams(),
  };
};
