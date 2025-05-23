
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: string;
  isPositive?: boolean;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  change,
  isPositive = true,
  className,
}: StatsCardProps) => {
  return (
    <div className={cn("stats-card", className)}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {change && (
            <p
              className={cn(
                "text-xs font-medium mt-1",
                isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {isPositive ? "+" : "-"}{change} since last month
            </p>
          )}
        </div>
        <div className="p-2 rounded-lg bg-muted/50">{icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;
