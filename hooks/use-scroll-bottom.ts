import { useEffect } from "react";

interface UseScrollToBottomProps {
  bottomRef: React.RefObject<HTMLElement>;
  data: any;
  isNewMessageAdded: boolean; // New prop to determine when a new message is added
  isInitialLoad: boolean; // Detect the initial load
}

export const useScrollToBottom = ({
  bottomRef,
  data,
  isNewMessageAdded,
  isInitialLoad,
}: UseScrollToBottomProps) => {
  useEffect(() => {
    if (bottomRef.current) {
      // Scroll to bottom on initial load or when a new message is added
      if (isInitialLoad || isNewMessageAdded) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [data, bottomRef, isNewMessageAdded, isInitialLoad]); // Trigger when `data` changes (new message added or first load)
};
