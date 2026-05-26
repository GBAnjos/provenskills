import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getSkillsByCreator } from "@/lib/db";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile(user.id);

  if (!profile) {
    redirect("/login");
  }

  // Get creator's skills if they are a creator
  const creatorSkills = profile.is_creator
    ? await getSkillsByCreator(user.id)
    : [];

  // Get purchased skills
  const { data: purchases } = await supabase
    .from("purchases")
    .select(
      `
      *,
      skill:skills(
        *,
        category:categories(*),
        creator:profiles(*)
      )
    `
    )
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  return (
    <DashboardClient
      user={user}
      profile={profile}
      creatorSkills={creatorSkills}
      purchases={(purchases as any) || []}
    />
  );
}
