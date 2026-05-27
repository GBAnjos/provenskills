"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Search,
  Download,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Badge } from "@/components/ui";
import { Spotlight } from "@/components/ui/aceternity";
import type { SkillWithRelations } from "@/lib/db/skills";

interface Purchase {
  id: string;
  skill_id: string;
  price_paid: number;
  created_at: string;
  skill: SkillWithRelations;
}

interface LibraryClientProps {
  purchases: Purchase[];
}

function SkillLibraryCard({ purchase, index }: { purchase: Purchase; index: number }) {
  const [copied, setCopied] = useState(false);
  const skill = purchase.skill;

  const handleCopy = () => {
    navigator.clipboard.writeText(skill.install_command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const installDate = new Date(purchase.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-border bg-card p-6 hover:border-[var(--proven-green-500)]/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--proven-green-500)] to-[var(--proven-green-600)] text-xl">
            {skill.category?.icon || "📦"}
          </div>
          <div>
            <Link
              href={`/skills/${skill.slug}`}
              className="font-semibold hover:text-[var(--proven-green-500)] transition-colors"
            >
              {skill.name}
            </Link>
            <p className="text-sm text-muted">v{skill.version}</p>
          </div>
        </div>
        <Badge
          variant="success"
          icon={<ShieldCheck className="h-3 w-3" />}
        >
          {skill.security_grade}
        </Badge>
      </div>

      <p className="text-sm text-muted mb-4 line-clamp-2">{skill.description}</p>

      {/* Install Command */}
      <div className="mb-4">
        <div className="flex items-center gap-2 rounded-lg bg-background border border-border p-3">
          <Terminal className="h-4 w-4 text-muted shrink-0" />
          <code className="flex-1 text-sm truncate text-muted">
            {skill.install_command}
          </code>
          <button
            onClick={handleCopy}
            className="shrink-0 p-1 hover:bg-card rounded transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-[var(--proven-green-500)]" />
            ) : (
              <Copy className="h-4 w-4 text-muted hover:text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-muted">
          <Clock className="h-4 w-4" />
          Installed {installDate}
        </div>
        <div className="flex items-center gap-3">
          {skill.github_url && (
            <a
              href={skill.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted hover:text-[var(--proven-green-500)] transition-colors"
            >
              Source
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <Link
            href={`/skills/${skill.slug}`}
            className="flex items-center gap-1 text-[var(--proven-green-500)] hover:underline"
          >
            View Details
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function LibraryClient({ purchases }: LibraryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPurchases = purchases.filter((purchase) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      purchase.skill.name.toLowerCase().includes(query) ||
      purchase.skill.description.toLowerCase().includes(query) ||
      purchase.skill.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <Spotlight
            className="-top-40 left-0 md:-top-20 md:left-60"
            fill="var(--proven-green-500)"
          />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge
                variant="success"
                icon={<Package className="h-3 w-3" />}
                className="mb-4"
              >
                {purchases.length} Skills Installed
              </Badge>
              <h1 className="text-4xl font-bold">Your Library</h1>
              <p className="mt-2 text-muted">
                All your installed and purchased skills in one place.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Search */}
            {purchases.length > 0 && (
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="search"
                    placeholder="Search your library..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm placeholder:text-muted focus:border-[var(--proven-green-500)] focus:outline-none focus:ring-1 focus:ring-[var(--proven-green-500)]"
                  />
                </div>
              </div>
            )}

            {/* Skills Grid */}
            {filteredPurchases.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredPurchases.map((purchase, index) => (
                  <SkillLibraryCard key={purchase.id} purchase={purchase} index={index} />
                ))}
              </div>
            ) : purchases.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Search className="h-12 w-12 text-muted mx-auto" />
                <h3 className="mt-4 text-lg font-semibold">No skills found</h3>
                <p className="mt-2 text-muted">
                  Try a different search term
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-card">
                  <Package className="h-12 w-12 text-muted" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">Your library is empty</h3>
                <p className="mt-2 text-muted max-w-md mx-auto">
                  Browse our marketplace to find AI skills that enhance your workflow.
                </p>
                <Link
                  href="/skills"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--proven-green-500)] px-6 py-3 font-medium text-white hover:bg-[var(--proven-green-600)] transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Browse Skills
                </Link>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
