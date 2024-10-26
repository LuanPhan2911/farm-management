"use client";

import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { createContext, PropsWithChildren, ReactNode, useState } from "react";
import { Hint } from "../hint";
import { Button } from "../ui/button";

export const ChartContext = createContext<{
  isShown: boolean;
  query: Record<string, any>;
}>({
  isShown: false,
  query: {},
});
interface ChartProps extends PropsWithChildren {
  query?: Record<string, any>;
  renderQuery?: () => ReactNode;
}
export const ChartWrapper = ({ query, renderQuery, children }: ChartProps) => {
  const [isShown, setShown] = useState<boolean>(true);

  const Icon: LucideIcon = isShown ? EyeOff : Eye;
  return (
    <ChartContext.Provider
      value={{
        isShown,
        query: query || {},
      }}
    >
      <div className="flex flex-col gap-y-4 p-4 border rounded-lg">
        <div className="flex justify-end">
          <Hint label="Show/Hide chart" asChild>
            <Button
              size={"icon"}
              variant={"cyan"}
              onClick={() => setShown(!isShown)}
            >
              <Icon className="h-4 w-4" />
            </Button>
          </Hint>
        </div>
        {renderQuery?.()}
        {children}
      </div>
    </ChartContext.Provider>
  );
};
