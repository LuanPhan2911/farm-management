"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";

const NotFoundPage = () => {
  const router = useRouter();
  return (
    <div className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          {"Page not found"}
        </h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground">
          {"Sorry, we couldn’t find the page you’re looking for."}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button variant={"blue"} size={"sm"} onClick={() => router.back()}>
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
