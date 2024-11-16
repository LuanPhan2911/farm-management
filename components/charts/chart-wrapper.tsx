"use client";

import { createContext, PropsWithChildren, ReactNode } from "react";

export const ChartContext = createContext<{
  query: Record<string, any>;
}>({
  query: {},
});
interface ChartProps extends PropsWithChildren {
  query?: Record<string, any>;
  renderQuery?: () => ReactNode;
}
export const ChartWrapper = ({ query, renderQuery, children }: ChartProps) => {
  return (
    <ChartContext.Provider
      value={{
        query: query || {},
      }}
    >
      <div className="flex flex-col gap-y-4 my-4 shadow-lg">
        {renderQuery?.()}
        {children}
      </div>
    </ChartContext.Provider>
  );
};
