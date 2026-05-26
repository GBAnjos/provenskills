"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SparkleProps {
  id: string;
  createdAt: number;
  color: string;
  size: number;
  style: {
    top: string;
    left: string;
  };
}

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

const generateSparkle = (color: string): SparkleProps => {
  return {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    color,
    size: random(10, 20),
    style: {
      top: random(0, 100) + "%",
      left: random(0, 100) + "%",
    },
  };
};

const Sparkle = ({ size, color, style }: Omit<SparkleProps, "id" | "createdAt">) => {
  return (
    <motion.svg
      className="absolute z-20 pointer-events-none"
      style={style}
      initial={{ scale: 0, rotate: 0 }}
      animate={{ scale: [0, 1, 0], rotate: [0, 180] }}
      transition={{ duration: 0.6 }}
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
    >
      <path
        d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
        fill={color}
      />
    </motion.svg>
  );
};

export function SparklesText({
  children,
  className,
  sparklesCount = 10,
  colors = { first: "#00dc82", second: "#3b82f6" },
}: {
  children: React.ReactNode;
  className?: string;
  sparklesCount?: number;
  colors?: { first: string; second: string };
}) {
  const [sparkles, setSparkles] = useState<SparkleProps[]>([]);

  useEffect(() => {
    const generateInitialSparkles = () => {
      return [...new Array(sparklesCount)].map(() =>
        generateSparkle(Math.random() > 0.5 ? colors.first : colors.second)
      );
    };

    setSparkles(generateInitialSparkles());

    const interval = setInterval(() => {
      const now = Date.now();
      const sparkle = generateSparkle(
        Math.random() > 0.5 ? colors.first : colors.second
      );

      setSparkles((prev) => {
        const filtered = prev.filter((s) => now - s.createdAt < 750);
        return [...filtered, sparkle];
      });
    }, 250);

    return () => clearInterval(interval);
  }, [colors.first, colors.second, sparklesCount]);

  return (
    <span className={cn("relative inline-block", className)}>
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </span>
  );
}
