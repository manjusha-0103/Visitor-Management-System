import { TrendingUp, TrendingDown } from "lucide-react";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  delta?: number;          // positive = up (good), negative = down (bad)
  deltaInvert?: boolean;   // true = negative delta is actually good (e.g. wait time)
  icon?: ReactNode;
}

export default function MetricCard({ label, value, sub, delta, deltaInvert, icon }: MetricCardProps) {
  const isPositive = deltaInvert ? (delta ?? 0) < 0 : (delta ?? 0) > 0;
  const isNeutral  = delta === undefined;

  return (
    <div className="bg-muted/50 rounded-xl p-4 flex flex-col gap-1 min-w-0">
      {icon && <div className="mb-1 text-muted-foreground">{icon}</div>}
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium leading-none">
        {label}
      </p>
      <p className="text-[28px] font-semibold text-foreground leading-tight tracking-tight">
        {value}
      </p>
      {(sub || delta !== undefined) && (
        <div className="flex items-center gap-1 mt-0.5">
          {!isNeutral && (
            isPositive
              ? <TrendingUp size={11} className="text-green-600 flex-shrink-0" />
              : <TrendingDown size={11} className="text-red-500 flex-shrink-0" />
          )}
          <p className={`text-[11px] font-medium leading-none ${
            isNeutral ? "text-muted-foreground" :
            isPositive ? "text-green-700" : "text-red-500"
          }`}>
            {sub}
          </p>
        </div>
      )}
    </div>
  );
}