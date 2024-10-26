import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { locales } from "./configs/localeConfig";

// Can be imported from a shared config

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`@/messages/${locale}.json`)).default,
    formats: {
      dateTime: {
        short: {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      },
      number: {
        precise: {
          maximumFractionDigits: 3,
        },
      },
      list: {
        enumeration: {
          style: "long",
          type: "conjunction",
        },
      },
    },
  };
});
