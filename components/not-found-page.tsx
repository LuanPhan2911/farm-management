"use client";

import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { usePrefix } from "@/hooks/use-prefix";

interface NotFoundPageProps {
  title?: string;
  description?: string;
  backButtonUrl?: string;
  backButtonLabel?: string;
}
export const NotFoundPage = ({
  backButtonLabel,
  description,
  title,
  backButtonUrl,
}: NotFoundPageProps) => {
  const prefix = usePrefix();
  return (
    <div className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          {title || "Page not found"}
        </h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground">
          {description ||
            "Sorry, we couldn’t find the page you’re looking for."}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href={prefix ? `${prefix}/${backButtonUrl}` : backButtonUrl || "/"}
          >
            <Button variant={"blue"} size={"sm"}>
              {backButtonLabel || "Go to dashboard"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
