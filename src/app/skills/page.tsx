import { Suspense } from "react";
import { getSkills, getCategories } from "@/lib/db";
import { SkillsPageClient } from "./skills-client";
import { Header, Footer } from "@/components/layout";

// Loading skeleton
function SkillsLoading() {
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

// Server component that fetches data
async function SkillsData({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const initialCategory = params.category || "all";

  // Fetch initial data on server
  const [skills, categories] = await Promise.all([
    getSkills({ category: initialCategory !== "all" ? initialCategory : undefined }),
    getCategories(),
  ]);

  return (
    <SkillsPageClient
      initialSkills={skills}
      categories={categories}
      initialCategory={initialCategory}
    />
  );
}

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  return (
    <Suspense fallback={<SkillsLoading />}>
      <SkillsData searchParams={searchParams} />
    </Suspense>
  );
}
