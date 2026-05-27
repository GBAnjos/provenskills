"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function installFreeSkill(skillId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to install skills" };
  }

  // Check if skill exists and is free
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: skill } = await (supabase.from("skills") as any)
    .select("id, is_free, name")
    .eq("id", skillId)
    .single();

  if (!skill) {
    return { error: "Skill not found" };
  }

  if (!skill.is_free) {
    return { error: "This skill requires purchase" };
  }

  // Check if already installed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existingPurchase } = await (supabase.from("purchases") as any)
    .select("id")
    .eq("skill_id", skillId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingPurchase) {
    return { error: "Skill already installed", alreadyInstalled: true };
  }

  // Create purchase record for free skill
  const purchaseData = {
    skill_id: skillId,
    user_id: user.id,
    price_paid: 0,
    status: "completed",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: purchaseError } = await (supabase.from("purchases") as any)
    .insert(purchaseData);

  if (purchaseError) {
    console.error("Error installing skill:", purchaseError);
    return { error: "Failed to install skill" };
  }

  // Increment download count
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("skills") as any)
    .update({ downloads: skill.downloads + 1 })
    .eq("id", skillId);

  revalidatePath("/dashboard");
  revalidatePath(`/skills`);

  return { success: true, skillName: skill.name };
}

export async function checkSkillOwnership(skillId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { owned: false, loggedIn: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: purchase } = await (supabase.from("purchases") as any)
    .select("id, created_at")
    .eq("skill_id", skillId)
    .eq("user_id", user.id)
    .eq("status", "completed")
    .maybeSingle();

  return {
    owned: !!purchase,
    loggedIn: true,
    purchaseDate: purchase?.created_at,
  };
}

export async function getUserPurchases() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", purchases: [] };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: purchases, error } = await (supabase.from("purchases") as any)
    .select(`
      *,
      skill:skills(
        *,
        category:categories(*),
        creator:profiles(*)
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching purchases:", error);
    return { error: "Failed to fetch purchases", purchases: [] };
  }

  return { purchases: purchases || [] };
}
