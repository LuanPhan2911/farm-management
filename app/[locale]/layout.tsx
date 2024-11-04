import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { DialogProvider } from "@/components/providers/dialog-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/[locale]/api/uploadthing/core";
import { SheetProvider } from "@/components/providers/sheet-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NetMarket",
  description: "Buy anything",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: {
    locale: string;
  };
}>) {
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning={true}>
        <body className={inter.className}>
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <NextIntlClientProvider
            messages={messages}
            formats={{
              dateTime: {
                short: {
                  year: "numeric",
                  day: "2-digit",
                  month: "2-digit",
                },
                long: {
                  day: "2-digit",
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
            }}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <QueryProvider>
                {children}
                <Toaster duration={10000} />
                <DialogProvider />
                <SheetProvider />
              </QueryProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
