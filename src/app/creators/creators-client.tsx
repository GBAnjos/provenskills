"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  BadgeCheck,
  TrendingUp,
  Package,
  Star,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Badge } from "@/components/ui";
import { Spotlight, BackgroundGradient } from "@/components/ui/aceternity";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/db/profiles";

interface CreatorsPageClientProps {
  creators: Profile[];
}

const sortOptions = [
  { value: "sales", label: "Top Sellers" },
  { value: "skills", label: "Most Skills" },
  { value: "newest", label: "Newest" },
];

function CreatorCard({ creator, index }: { creator: Profile; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/creators/${creator.username}`}>
        <BackgroundGradient className="rounded-2xl" containerClassName="h-full">
          <div className="h-full rounded-2xl border border-border bg-card p-6 hover:border-[var(--proven-green-500)]/50 transition-colors">
            {/* Avatar */}
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--proven-green-500)] to-[var(--proven-green-600)] text-2xl font-bold text-white">
                {creator.username?.[0]?.toUpperCase() || "?"}
              </div>
              {creator.is_verified && (
                <Badge variant="success" icon={<BadgeCheck className="h-3 w-3" />}>
                  Verified
                </Badge>
              )}
            </div>

            {/* Info */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{creator.full_name || creator.username}</h3>
              </div>
              <p className="text-sm text-muted">@{creator.username}</p>
              {creator.bio && (
                <p className="mt-2 text-sm text-muted line-clamp-2">{creator.bio}</p>
              )}
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-lg font-bold">{creator.skills_count || 0}</p>
                <p className="text-xs text-muted">Skills</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{creator.total_sales || 0}</p>
                <p className="text-xs text-muted">Sales</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <p className="text-lg font-bold">
                    {creator.average_rating ? Number(creator.average_rating).toFixed(1) : "—"}
                  </p>
                </div>
                <p className="text-xs text-muted">Rating</p>
              </div>
            </div>
          </div>
        </BackgroundGradient>
      </Link>
    </motion.div>
  );
}

export function CreatorsPageClient({ creators }: CreatorsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("sales");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const filteredCreators = useMemo(() => {
    let filtered = [...creators];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (creator) =>
          creator.username?.toLowerCase().includes(query) ||
          creator.full_name?.toLowerCase().includes(query) ||
          creator.bio?.toLowerCase().includes(query)
      );
    }

    // Verified filter
    if (showVerifiedOnly) {
      filtered = filtered.filter((creator) => creator.is_verified);
    }

    // Sort
    switch (selectedSort) {
      case "sales":
        filtered.sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0));
        break;
      case "skills":
        filtered.sort((a, b) => (b.skills_count || 0) - (a.skills_count || 0));
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    return filtered;
  }, [creators, searchQuery, selectedSort, showVerifiedOnly]);

  const verifiedCount = creators.filter((c) => c.is_verified).length;
  const totalSkills = creators.reduce((acc, c) => acc + (c.skills_count || 0), 0);

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

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Badge
                variant="success"
                icon={<Users className="h-3 w-3" />}
                className="mb-4"
              >
                {creators.length} Creators
              </Badge>
              <h1 className="text-4xl font-bold sm:text-5xl">
                Meet Our Creators
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                Talented developers building the future of AI tooling.
                Earn 80% on every sale you make.
              </p>

              {/* Quick Stats */}
              <div className="mt-8 flex items-center justify-center gap-8">
                <div className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="h-4 w-4 text-[var(--proven-green-500)]" />
                  <span>{verifiedCount} Verified Creators</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-[var(--proven-green-500)]" />
                  <span>{totalSkills} Skills Published</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters & Results */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Search & Filter Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  placeholder="Search creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm placeholder:text-muted focus:border-[var(--proven-green-500)] focus:outline-none focus:ring-1 focus:ring-[var(--proven-green-500)]"
                />
              </div>

              <div className="flex items-center gap-3">
                {/* Verified Toggle */}
                <button
                  onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-xl border px-4 text-sm transition-colors",
                    showVerifiedOnly
                      ? "border-[var(--proven-green-500)] bg-[var(--proven-green-500)]/10 text-[var(--proven-green-500)]"
                      : "border-border bg-card hover:border-[var(--proven-green-500)]/50"
                  )}
                >
                  <BadgeCheck className="h-4 w-4" />
                  Verified Only
                </button>

                {/* Sort Dropdown */}
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="h-11 appearance-none rounded-xl border border-border bg-card pl-4 pr-10 text-sm focus:border-[var(--proven-green-500)] focus:outline-none focus:ring-1 focus:ring-[var(--proven-green-500)]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted">
                Showing <span className="font-medium text-foreground">{filteredCreators.length}</span> creators
              </p>
            </div>

            {/* Creators Grid */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCreators.map((creator, index) => (
                <CreatorCard key={creator.id} creator={creator} index={index} />
              ))}
            </div>

            {/* Empty State */}
            {filteredCreators.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-center"
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-card">
                  <Users className="h-10 w-10 text-muted" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No creators found</h3>
                <p className="mt-2 text-muted">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowVerifiedOnly(false);
                  }}
                  className="mt-4 text-[var(--proven-green-500)] hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16 rounded-2xl border border-border bg-card p-8 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--proven-green-500)]/10 mb-4">
                <TrendingUp className="h-8 w-8 text-[var(--proven-green-500)]" />
              </div>
              <h2 className="text-2xl font-bold">Become a Creator</h2>
              <p className="mt-2 text-muted max-w-md mx-auto">
                Join our community of talented developers. Earn 80% of every sale
                with free security certification for all your skills.
              </p>
              <Link
                href="/sell"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--proven-green-500)] px-6 py-3 font-medium text-white hover:bg-[var(--proven-green-600)] transition-colors"
              >
                Start Selling
                <TrendingUp className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
