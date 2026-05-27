import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSkillBySlug } from "@/lib/db";
import { checkSkillOwnership, getUserReviewForSkill } from "@/lib/actions";
import { SkillDetailClient } from "./skill-detail-client";
import { Header, Footer } from "@/components/layout";

// Loading skeleton
function SkillDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--proven-green-500)] border-t-transparent mx-auto" />
          <p className="mt-4 text-muted">Loading skill details...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Server component that fetches data
async function SkillDetailData({ slug }: { slug: string }) {
  const skill = await getSkillBySlug(slug);

  if (!skill) {
    notFound();
  }

  // Check if current user owns this skill and has reviewed it
  const [ownership, userReview] = await Promise.all([
    checkSkillOwnership(skill.id),
    getUserReviewForSkill(skill.id),
  ]);

  return (
    <SkillDetailClient
      skill={skill}
      isOwned={ownership.owned}
      isLoggedIn={ownership.loggedIn}
      hasReviewed={!!userReview.review}
    />
  );
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={<SkillDetailLoading />}>
      <SkillDetailData slug={slug} />
    </Suspense>
  );
}
