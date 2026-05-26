import { Suspense } from "react";
import { getSkills, getCategories } from "@/lib/db";
import { MCPServersPageClient } from "./mcp-servers-client";
import { Header, Footer } from "@/components/layout";

function MCPServersLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--proven-green-500)] border-t-transparent mx-auto" />
          <p className="mt-4 text-muted">Loading MCP servers...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

async function MCPServersData({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const initialCategory = params.category || "all";

  const [servers, categories] = await Promise.all([
    getSkills({ category: initialCategory !== "all" ? initialCategory : undefined }),
    getCategories(),
  ]);

  return (
    <MCPServersPageClient
      initialServers={servers}
      categories={categories}
      initialCategory={initialCategory}
    />
  );
}

export default async function MCPServersPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  return (
    <Suspense fallback={<MCPServersLoading />}>
      <MCPServersData searchParams={searchParams} />
    </Suspense>
  );
}
