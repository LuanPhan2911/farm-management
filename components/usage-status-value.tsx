"use client";

export const UsageStatusValue = ({ status }: { status: boolean }) => {
  if (!status) {
    return <span className="text-rose-400 font-bold">No usage</span>;
  }
  return <span className="text-green-400 font-bold">Usage</span>;
};
