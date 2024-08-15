import { LocalePrefix, Pathnames } from "next-intl/routing";
export type Locale = (typeof locales)[number];

export const defaultLocale = "en" as const;
export const locales = ["en", "vi"] as const;

export const pathnames: Pathnames<typeof locales> = {
  "/": "/",
  "/pathnames": {
    en: "/pathnames",
    vi: "/pathnames",
  },
};

export const localePrefix: LocalePrefix<typeof locales> = "always";
