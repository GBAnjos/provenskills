"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  X,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Badge, LinkButton } from "@/components/ui";
import { SkillCard } from "@/components/skills";
import { Spotlight } from "@/components/ui/aceternity";
import { cn } from "@/lib/utils";

// Mock data for development - will be replaced with Supabase queries
const mockSkills = [
  {
    id: "1",
    name: "SEO Audit Pro",
    slug: "seo-audit-pro",
    description: "Comprehensive SEO analysis with actionable recommendations for your website. Analyzes meta tags, content, and technical SEO factors.",
    long_description: null,
    price: 14.99,
    is_free: false,
    category_id: "1",
    creator_id: "1",
    install_command: "claude install @seomaster/seo-audit-pro",
    github_url: "https://github.com/seomaster/seo-audit-pro",
    version: "2.1.0",
    downloads: 2340,
    rating: 4.9,
    review_count: 128,
    security_score: "95",
    security_grade: "A",
    badges: ["security-certified", "top-rated"],
    tags: ["seo", "audit", "marketing"],
    is_published: true,
    is_featured: true,
    scanned_at: "2024-01-15T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    category: { id: "1", name: "Frontend", slug: "frontend", description: "", icon: "🎨", skill_count: 89, created_at: "" },
    creator: { id: "1", username: "seomaster", full_name: "SEO Master", avatar_url: null, bio: null, website_url: null, github_url: null, twitter_url: null, is_creator: true, is_verified: true, stripe_account_id: null, stripe_onboarding_complete: false, total_sales: 500, total_earnings: 5000, created_at: "", updated_at: "" },
  },
  {
    id: "2",
    name: "API Documentation Generator",
    slug: "api-documentation",
    description: "Auto-generate beautiful API docs from your OpenAPI specs, GraphQL schemas, or code comments.",
    long_description: null,
    price: 0,
    is_free: true,
    category_id: "2",
    creator_id: "2",
    install_command: "claude install @docgen/api-docs",
    github_url: "https://github.com/docgen/api-docs",
    version: "3.0.0",
    downloads: 5621,
    rating: 4.7,
    review_count: 234,
    security_score: "92",
    security_grade: "A",
    badges: ["security-certified"],
    tags: ["api", "documentation", "openapi"],
    is_published: true,
    is_featured: true,
    scanned_at: "2024-01-14T00:00:00Z",
    created_at: "2023-12-15T00:00:00Z",
    updated_at: "2024-01-14T00:00:00Z",
    category: { id: "2", name: "Documentation", slug: "documentation", description: "", icon: "📝", skill_count: 56, created_at: "" },
    creator: { id: "2", username: "docgen", full_name: "Doc Generator", avatar_url: null, bio: null, website_url: null, github_url: null, twitter_url: null, is_creator: true, is_verified: true, stripe_account_id: null, stripe_onboarding_complete: false, total_sales: 0, total_earnings: 0, created_at: "", updated_at: "" },
  },
  {
    id: "3",
    name: "Test Generator AI",
    slug: "test-generator",
    description: "Generate comprehensive unit tests, integration tests, and e2e tests from your code automatically.",
    long_description: null,
    price: 19.99,
    is_free: false,
    category_id: "3",
    creator_id: "3",
    install_command: "claude install @testcraft/test-generator",
    github_url: "https://github.com/testcraft/test-generator",
    version: "1.5.0",
    downloads: 1892,
    rating: 5.0,
    review_count: 89,
    security_score: "98",
    security_grade: "A+",
    badges: ["security-certified", "top-rated", "enterprise-ready"],
    tags: ["testing", "unit-tests", "automation"],
    is_published: true,
    is_featured: true,
    scanned_at: "2024-01-16T00:00:00Z",
    created_at: "2023-11-01T00:00:00Z",
    updated_at: "2024-01-16T00:00:00Z",
    category: { id: "3", name: "Testing", slug: "testing", description: "", icon: "🧪", skill_count: 93, created_at: "" },
    creator: { id: "3", username: "testcraft", full_name: "Test Craft", avatar_url: null, bio: null, website_url: null, github_url: null, twitter_url: null, is_creator: true, is_verified: true, stripe_account_id: null, stripe_onboarding_complete: false, total_sales: 200, total_earnings: 4000, created_at: "", updated_at: "" },
  },
  {
    id: "4",
    name: "Code Review AI",
    slug: "code-review-ai",
    description: "AI-powered code review that catches bugs, security issues, performance problems, and style inconsistencies.",
    long_description: null,
    price: 24.99,
    is_free: false,
    category_id: "2",
    creator_id: "4",
    install_command: "claude install @reviewbot/code-review",
    github_url: "https://github.com/reviewbot/code-review",
    version: "2.0.0",
    downloads: 3104,
    rating: 4.8,
    review_count: 156,
    security_score: "88",
    security_grade: "B+",
    badges: ["security-certified", "enterprise-ready"],
    tags: ["code-review", "security", "quality"],
    is_published: true,
    is_featured: true,
    scanned_at: "2024-01-12T00:00:00Z",
    created_at: "2023-10-15T00:00:00Z",
    updated_at: "2024-01-12T00:00:00Z",
    category: { id: "2", name: "Backend", slug: "backend", description: "", icon: "⚙️", skill_count: 124, created_at: "" },
    creator: { id: "4", username: "reviewbot", full_name: "Review Bot", avatar_url: null, bio: null, website_url: null, github_url: null, twitter_url: null, is_creator: true, is_verified: false, stripe_account_id: null, stripe_onboarding_complete: false, total_sales: 350, total_earnings: 8750, created_at: "", updated_at: "" },
  },
  {
    id: "5",
    name: "Database Schema Designer",
    slug: "database-schema",
    description: "Design and visualize database schemas with AI-powered suggestions for normalization and indexing.",
    long_description: null,
    price: 9.99,
    is_free: false,
    category_id: "6",
    creator_id: "5",
    install_command: "claude install @datacraft/schema-designer",
    github_url: null,
    version: "1.2.0",
    downloads: 987,
    rating: 4.6,
    review_count: 45,
    security_score: "91",
    security_grade: "A",
    badges: ["security-certified"],
    tags: ["database", "schema", "design"],
    is_published: true,
    is_featured: false,
    scanned_at: "2024-01-10T00:00:00Z",
    created_at: "2023-12-01T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
    category: { id: "6", name: "Data", slug: "data", description: "", icon: "📊", skill_count: 78, created_at: "" },
    creator: { id: "5", username: "datacraft", full_name: "Data Craft", avatar_url: null, bio: null, website_url: null, github_url: null, twitter_url: null, is_creator: true, is_verified: true, stripe_account_id: null, stripe_onboarding_complete: false, total_sales: 100, total_earnings: 1000, created_at: "", updated_at: "" },
  },
  {
    id: "6",
    name: "Regex Builder",
    slug: "regex-builder",
    description: "Build and test complex regular expressions using natural language descriptions.",
    long_description: null,
    price: 0,
    is_free: true,
    category_id: "2",
    creator_id: "6",
    install_command: "claude install @regexmaster/builder",
    github_url: "https://github.com/regexmaster/builder",
    version: "1.0.0",
    downloads: 4230,
    rating: 4.9,
    review_count: 312,
    security_score: "94",
    security_grade: "A",
    badges: ["security-certified", "top-rated"],
    tags: ["regex", "patterns", "strings"],
    is_published: true,
    is_featured: false,
    scanned_at: "2024-01-08T00:00:00Z",
    created_at: "2023-09-15T00:00:00Z",
    updated_at: "2024-01-08T00:00:00Z",
    category: { id: "2", name: "Backend", slug: "backend", description: "", icon: "⚙️", skill_count: 124, created_at: "" },
    creator: { id: "6", username: "regexmaster", full_name: "Regex Master", avatar_url: null, bio: null, website_url: null, github_url: null, twitter_url: null, is_creator: true, is_verified: true, stripe_account_id: null, stripe_onboarding_complete: false, total_sales: 0, total_earnings: 0, created_at: "", updated_at: "" },
  },
  {
    id: "7",
    name: "Docker Compose Generator",
    slug: "docker-compose-gen",
    description: "Generate Docker Compose files for complex multi-service architectures with best practices.",
    long_description: null,
    price: 12.99,
    is_free: false,
    category_id: "4",
    creator_id: "7",
    install_command: "claude install @devops/docker-compose",
    github_url: "https://github.com/devops/docker-compose",
    version: "2.3.0",
    downloads: 1567,
    rating: 4.5,
    review_count: 67,
    security_score: "89",
    security_grade: "B+",
    badges: ["security-certified"],
    tags: ["docker", "devops", "containers"],
    is_published: true,
    is_featured: false,
    scanned_at: "2024-01-11T00:00:00Z",
    created_at: "2023-08-01T00:00:00Z",
    updated_at: "2024-01-11T00:00:00Z",
    category: { id: "4", name: "DevOps", slug: "devops", description: "", icon: "🚀", skill_count: 67, created_at: "" },
    creator: { id: "7", username: "devopsmaster", full_name: "DevOps Master", avatar_url: null, bio: null, website_url: null, github_url: null, twitter_url: null, is_creator: true, is_verified: false, stripe_account_id: null, stripe_onboarding_complete: false, total_sales: 150, total_earnings: 1950, created_at: "", updated_at: "" },
  },
  {
    id: "8",
    name: "Security Audit Scanner",
    slug: "security-audit",
    description: "Comprehensive security scanning for your codebase. Detects vulnerabilities, secrets, and compliance issues.",
    long_description: null,
    price: 29.99,
    is_free: false,
    category_id: "7",
    creator_id: "8",
    install_command: "claude install @securedev/audit-scanner",
    github_url: null,
    version: "3.1.0",
    downloads: 2891,
    rating: 4.9,
    review_count: 198,
    security_score: "99",
    security_grade: "A+",
    badges: ["security-certified", "top-rated", "enterprise-ready"],
    tags: ["security", "audit", "vulnerability"],
    is_published: true,
    is_featured: true,
    scanned_at: "2024-01-17T00:00:00Z",
    created_at: "2023-06-01T00:00:00Z",
    updated_at: "2024-01-17T00:00:00Z",
    category: { id: "7", name: "Security", slug: "security", description: "", icon: "🔒", skill_count: 34, created_at: "" },
    creator: { id: "8", username: "securedev", full_name: "Secure Dev", avatar_url: null, bio: null, website_url: null, github_url: null, twitter_url: null, is_creator: true, is_verified: true, stripe_account_id: null, stripe_onboarding_complete: false, total_sales: 400, total_earnings: 12000, created_at: "", updated_at: "" },
  },
];

const categories = [
  { id: "all", name: "All Categories", slug: "all", icon: "📦" },
  { id: "1", name: "Frontend", slug: "frontend", icon: "🎨" },
  { id: "2", name: "Backend", slug: "backend", icon: "⚙️" },
  { id: "3", name: "Testing", slug: "testing", icon: "🧪" },
  { id: "4", name: "DevOps", slug: "devops", icon: "🚀" },
  { id: "5", name: "AI/ML", slug: "ai-ml", icon: "🤖" },
  { id: "6", name: "Data", slug: "data", icon: "📊" },
  { id: "7", name: "Security", slug: "security", icon: "🔒" },
  { id: "8", name: "Documentation", slug: "documentation", icon: "📝" },
];

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

function SkillsPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState("popular");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedSecurity, setSelectedSecurity] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredSkills = useMemo(() => {
    let skills = [...mockSkills];

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
    if (selectedCategory !== "all") {
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
          skills = skills.filter((skill) => skill.price < 10);
          break;
        case "under-25":
          skills = skills.filter((skill) => skill.price < 25);
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
        skills.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        skills.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        skills.sort((a, b) => b.price - a.price);
        break;
    }

    return skills;
  }, [searchQuery, selectedCategory, selectedSort, selectedPrice, selectedSecurity]);

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
                {mockSkills.length}+ Security-Certified Skills
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
                      {categories.map((cat) => (
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
              {categories.map((category) => (
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

function SkillsPageLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--proven-green-500)] border-t-transparent mx-auto" />
          <p className="mt-4 text-muted">Loading skills...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SkillsPage() {
  return (
    <Suspense fallback={<SkillsPageLoading />}>
      <SkillsPageContent />
    </Suspense>
  );
}
