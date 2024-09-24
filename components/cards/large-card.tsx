"use client";

interface LargeCardProps {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
}
export const LargeCard = ({ title, description }: LargeCardProps) => {
  return (
    <div className="flex flex-col gap-y-2 items-center justify-center py-4 min-h-[200px] max-w-6xl">
      <div className="text-lg font-semibold text-center">{title}</div>
      <div className="text-sm text-muted-foreground text-center">
        {description}
      </div>
    </div>
  );
};
