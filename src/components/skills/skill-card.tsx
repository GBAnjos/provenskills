"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Star, Download, User } from "lucide-react";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Tables } from "@/types/database";

type Skill = Tables<"skills"> & {
  category?: Tables<"categories"> | null;
  creator?: Tables<"profiles"> | null;
};

interface SkillCardProps {
  skill: Skill;
  index?: number;
}

function getSecurityBadgeVariant(grade: string) {
  switch (grade) {
    case "A":
    case "A+":
      return "success";
    case "B":
    case "B+":
      return "info";
    case "C":
    case "C+":
      return "warning";
    default:
      return "error";
  }
}

export function SkillCard({ skill, index = 0 }: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/skills/${skill.slug}`} className="group block">
        <div
          className={cn(
            "relative h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300",
            "hover:border-[var(--proven-green-500)]/50 hover:bg-card/80 hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--proven-green-500)]/5"
          )}
        >
          {/* Security Badge & Price */}
          <div className="flex items-start justify-between">
            <Badge
              size="sm"
              variant={getSecurityBadgeVariant(skill.security_grade)}
              icon={<ShieldCheck className="h-3 w-3" />}
            >
              {skill.security_grade}
            </Badge>
            {skill.is_free ? (
              <span className="text-sm font-semibold text-[var(--proven-green-500)]">
                FREE
              </span>
            ) : (
              <span className="text-sm font-semibold">
                ${Number(skill.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Title & Description */}
          <h3 className="mt-4 font-bold text-lg line-clamp-1 group-hover:text-[var(--proven-green-500)] transition-colors">
            {skill.name}
          </h3>
          <p className="text-sm text-muted line-clamp-2 mt-2">
            {skill.description}
          </p>

          {/* Creator */}
          <div className="mt-4 flex items-center gap-2 text-sm text-muted">
            {skill.creator?.avatar_url ? (
              <img
                src={skill.creator.avatar_url}
                alt={skill.creator.full_name || "Creator"}
                className="h-5 w-5 rounded-full"
              />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--proven-green-500)]/10">
                <User className="h-3 w-3 text-[var(--proven-green-500)]" />
              </div>
            )}
            <span>@{skill.creator?.username || "anonymous"}</span>
            {skill.creator?.is_verified && (
              <ShieldCheck className="h-3 w-3 text-[var(--proven-blue-500)]" />
            )}
          </div>

          {/* Category */}
          {skill.category && (
            <div className="mt-3">
              <Badge size="sm" variant="default">
                {skill.category.icon} {skill.category.name}
              </Badge>
            </div>
          )}

          {/* Stats */}
          <div className="mt-4 flex items-center justify-between text-sm pt-4 border-t border-border">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium">
                {Number(skill.rating) > 0 ? Number(skill.rating).toFixed(1) : "New"}
              </span>
              {skill.review_count > 0 && (
                <span className="text-muted">({skill.review_count})</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-muted">
              <Download className="h-4 w-4" />
              <span>{skill.downloads.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
