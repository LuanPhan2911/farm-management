"use client";

import { ActionResponse } from "@/types";
import { LucideIcon, Pause, RefreshCcw } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface LiveRefreshButtonProps {
  refreshFn: () => Promise<ActionResponse>;
}
export const LiveRefreshButton = ({ refreshFn }: LiveRefreshButtonProps) => {
  const [isLive, setLive] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // Store interval ID

  useEffect(() => {
    if (isLive) {
      const id = setInterval(() => {
        startTransition(async () => {
          await refreshFn(); // Call your refresh function to revalidate tasks
        });
      }, 10000); // Every 10 seconds

      // Save the interval ID
      setIntervalId(id);
    } else if (intervalId) {
      // If isLive is false, clear the interval
      clearInterval(intervalId);
      setIntervalId(null); // Reset intervalId state
    }

    // Cleanup function on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLive, startTransition]); // Only track isLive and startTransition

  const label = isLive ? "Live" : "Pause";
  const Icon: LucideIcon = isLive ? RefreshCcw : Pause;
  return (
    <Button
      size={"sm"}
      variant={isLive ? "success" : "edit"}
      onClick={() => setLive((prev) => !prev)}
      disabled={isPending}
      className="mx-2"
    >
      <Icon
        className={cn("h-4 w-4 mr-2", isLive && !isPending && "animate-spin")}
      />{" "}
      <span className="text-sm font-semibold">{label}</span>
    </Button>
  );
};
