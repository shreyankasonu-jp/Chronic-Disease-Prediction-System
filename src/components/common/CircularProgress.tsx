import React from "react";

type CircularProgressProps = {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: "primary" | "destructive" | "secondary";
};

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 140,
  strokeWidth = 10,
  label,
  color = "primary",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const colorClass =
    color === "destructive"
      ? "stroke-destructive"
      : color === "secondary"
      ? "stroke-secondary"
      : "stroke-primary";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-muted fill-none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={`${colorClass} fill-none transition-[stroke-dashoffset] duration-500 ease-out`}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-semibold">{Math.round(value)}%</div>
        {label && <div className="text-xs text-muted-foreground mt-1">{label}</div>}
      </div>
    </div>
  );
};

export default CircularProgress;
