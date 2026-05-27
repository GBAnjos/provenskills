import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProfileByUsername, getSkillsByCreator } from "@/lib/db";
import { CreatorProfileClient } from "./creator-profile-client";
import { Header, Footer } from "@/components/layout";

function ProfileLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--proven-green-500)] border-t-transparent mx-auto" />
          <p className="mt-4 text-muted">Loading profile...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

async function ProfileData({ username }: { username: string }) {
  const profile = await getProfileByUsername(username);

  if (!profile || !profile.is_creator) {
    notFound();
  }

  const skills = await getSkillsByCreator(profile.id);

  return <CreatorProfileClient profile={profile} skills={skills} />;
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileData username={username} />
    </Suspense>
  );
}
