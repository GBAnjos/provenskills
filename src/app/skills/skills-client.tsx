"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Badge } from "@/components/ui";
import { SkillCard } from "@/components/skills";
import { Spotlight } from "@/components/ui/aceternity";
import { cn } from "@/lib/utils";
import type { SkillWithRelations } from "@/lib/db/skills";
import type { Category } from "@/lib/db/categories";

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const priceFilters = [
  { value: "all", label: "All Prices" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
  { value: "under-10", label: "Under $10" },
  { value: "under-25", label: "Under $25" },
];

const securityFilters = [
  { value: "all", label: "All Grades" },
  { value: "a", label: "A Grade" },
  { value: "b", label: "B Grade" },
  { value: "c", label: "C Grade" },
];

interface SkillsPageClientProps {
  initialSkills: SkillWithRelations[];
  categories: Category[];
  initialCategory: string;
}

export function SkillsPageClient({
  initialSkills,
  categories,
  initialCategory,
}: SkillsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState("popular");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedSecurity, setSelectedSecurity] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Create category options with "All" at the beginning
  const categoryOptions = [
    { id: "all", name: "All Categories", slug: "all", icon: "📦", description: null, skill_count: 0, created_at: "" },
    ...categories,
  ];

  // Client-side filtering (for instant feedback)
  // In a production app, you'd want server-side filtering with URL params
  const filteredSkills = useMemo(() => {
    let skills = [...initialSkills];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      skills = skills.filter(
        (skill) =>
          skill.name.toLowerCase().includes(query) ||
          skill.description.toLowerCase().includes(query) ||
          skill.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== "all" && selectedCategory !== initialCategory) {
      skills = skills.filter(
        (skill) => skill.category?.slug === selectedCategory
      );
    }

    // Price filter
    if (selectedPrice !== "all") {
      switch (selectedPrice) {
        case "free":
          skills = skills.filter((skill) => skill.is_free);
          break;
        case "paid":
          skills = skills.filter((skill) => !skill.is_free);
          break;
        case "under-10":
          skills = skills.filter((skill) => Number(skill.price) < 10);
          break;
        case "under-25":
          skills = skills.filter((skill) => Number(skill.price) < 25);
          break;
      }
    }

    // Security filter
    if (selectedSecurity !== "all") {
      skills = skills.filter((skill) =>
        skill.security_grade.toLowerCase().startsWith(selectedSecurity)
      );
    }

    // Sort
    switch (selectedSort) {
      case "popular":
        skills.sort((a, b) => b.downloads - a.downloads);
        break;
      case "newest":
        skills.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "rating":
        skills.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case "price-low":
        skills.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        skills.sort((a, b) => Number(b.price) - Number(a.price));
        break;
    }

    return skills;
  }, [initialSkills, searchQuery, selectedCategory, selectedSort, selectedPrice, selectedSecurity, initialCategory]);

  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedPrice !== "all",
    selectedSecurity !== "all",
  ].filter(Boolean).length;

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
                icon={<Sparkles className="h-3 w-3" />}
                className="mb-4"
              >
                {initialSkills.length}+ Security-Certified Skills
              </Badge>
              <h1 className="text-4xl font-bold sm:text-5xl">
                Browse AI Skills
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                Every skill is security-scanned and certified. Install with confidence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters & Results */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Search & Filter Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm placeholder:text-muted focus:border-[var(--proven-green-500)] focus:outline-none focus:ring-1 focus:ring-[var(--proven-green-500)]"
                />
              </div>

              {/* Sort & Filter Buttons */}
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
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
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted pointer-events-none" />
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-xl border px-4 text-sm transition-colors",
                    showFilters
                      ? "border-[var(--proven-green-500)] bg-[var(--proven-green-500)]/10 text-[var(--proven-green-500)]"
                      : "border-border bg-card hover:border-[var(--proven-green-500)]/50"
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--proven-green-500)] text-xs text-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 rounded-2xl border border-border bg-card p-6"
              >
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Category */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-[var(--proven-green-500)] focus:outline-none"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Price
                    </label>
                    <select
                      value={selectedPrice}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-[var(--proven-green-500)] focus:outline-none"
                    >
                      {priceFilters.map((filter) => (
                        <option key={filter.value} value={filter.value}>
                          {filter.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Security Grade */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Security Grade
                    </label>
                    <select
                      value={selectedSecurity}
                      onChange={(e) => setSelectedSecurity(e.target.value)}
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-[var(--proven-green-500)] focus:outline-none"
                    >
                      {securityFilters.map((filter) => (
                        <option key={filter.value} value={filter.value}>
                          {filter.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedPrice("all");
                        setSelectedSecurity("all");
                        setSearchQuery("");
                      }}
                      className="flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm text-muted hover:text-foreground hover:border-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Category Pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all",
                    selectedCategory === category.slug
                      ? "bg-[var(--proven-green-500)] text-white"
                      : "border border-border bg-card hover:border-[var(--proven-green-500)]/50"
                  )}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted">
                Showing <span className="font-medium text-foreground">{filteredSkills.length}</span> skills
              </p>
            </div>

            {/* Skills Grid */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSkills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </div>

            {/* Empty State */}
            {filteredSkills.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-center"
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-card">
                  <Search className="h-10 w-10 text-muted" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No skills found</h3>
                <p className="mt-2 text-muted">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedPrice("all");
                    setSelectedSecurity("all");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-[var(--proven-green-500)] hover:underline"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
