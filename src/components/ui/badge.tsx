import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: "bg-card text-foreground border-border",
  success: "bg-[var(--proven-green-500)]/10 text-[var(--proven-green-500)] border-[var(--proven-green-500)]/20",
  warning: "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
  error: "bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20",
  info: "bg-[var(--proven-blue-500)]/10 text-[var(--proven-blue-500)] border-[var(--proven-blue-500)]/20",
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-3 py-1 gap-1.5",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
