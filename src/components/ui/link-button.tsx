import Link from "next/link";
import { cn } from "@/lib/utils";

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  endContent?: React.ReactNode;
  startContent?: React.ReactNode;
  onClick?: () => void;
}

const variantStyles = {
  primary:
    "bg-[var(--proven-green-500)] text-white hover:bg-[var(--proven-green-600)]",
  secondary: "bg-card text-foreground hover:bg-card/80 border border-border",
  ghost: "text-foreground hover:bg-card",
  outline: "border border-border text-foreground hover:bg-card",
};

const sizeStyles = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export function LinkButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  endContent,
  startContent,
  onClick,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--proven-green-500)] focus-visible:ring-offset-2",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {startContent}
      {children}
      {endContent}
    </Link>
  );
}
