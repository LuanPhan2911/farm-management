import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePrevious } from "@/hooks/use-previous";
import { usePathname, useRouter } from "@/navigation";

import { useConfirmWhenChangeRoute } from "@/stores/use-confirm-when-change-route";
import { useSearchParams } from "next/navigation";

import { useCallback, useEffect, useState } from "react";

export const UnsavedChangesDialog = () => {
  const { shouldConfirmLeave, isOpen, setOpen } = useConfirmWhenChangeRoute();
  const [nextRouterPath, setNextRouterPath] = useState<string>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const prevPathname = usePrevious(pathname);
  const prevSearchParams = usePrevious(searchParams!);
  const onRouteChangeStart = useCallback(
    (nextPath: string) => {
      if (!shouldConfirmLeave) {
        return;
      }

      setOpen(true);
      setNextRouterPath(nextPath);
    },
    [shouldConfirmLeave, setOpen]
  );

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    const prevUrl = `${prevPathname}?${prevSearchParams}`;
    if (url !== prevUrl) {
      onRouteChangeStart(url);
    }
  }, [
    pathname,
    searchParams,
    prevPathname,
    prevSearchParams,
    onRouteChangeStart,
  ]);

  const onRejectRouteChange = () => {
    setNextRouterPath(undefined);
    setOpen(false);
  };

  const onConfirmRouteChange = () => {
    setOpen(false);
    // simply remove the listener here so that it doesn't get triggered when we push the new route.
    // This assumes that the component will be removed anyway as the route changes
    if (nextRouterPath) {
      router.push(nextRouterPath);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={() => setOpen(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
          <AlertDialogDescription>
            Leaving this page will discard unsaved changes. Are you sure?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onRejectRouteChange}>
            Go back
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmRouteChange}>
            Discard changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
