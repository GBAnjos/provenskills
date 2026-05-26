"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface UpdateProfileData {
  username?: string;
  full_name?: string;
  bio?: string;
  website_url?: string;
  github_url?: string;
  twitter_url?: string;
}

export async function updateProfile(data: UpdateProfileData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Validate username if provided
  if (data.username) {
    // Check if username is taken by another user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingUser } = await (supabase.from("profiles") as any)
      .select("id")
      .eq("username", data.username)
      .neq("id", user.id)
      .maybeSingle();

    if (existingUser) {
      return { error: "Username is already taken" };
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_-]+$/.test(data.username)) {
      return { error: "Username can only contain letters, numbers, underscores, and hyphens" };
    }

    if (data.username.length < 3 || data.username.length > 30) {
      return { error: "Username must be between 3 and 30 characters" };
    }
  }

  // Update profile
  const updateData = {
    username: data.username,
    full_name: data.full_name,
    bio: data.bio,
    website_url: data.website_url || null,
    github_url: data.github_url || null,
    twitter_url: data.twitter_url || null,
    updated_at: new Date().toISOString(),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("profiles") as any)
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function becomeCreator() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check if user already is a creator
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase.from("profiles") as any)
    .select("is_creator")
    .eq("id", user.id)
    .single();

  if ((profile as { is_creator?: boolean })?.is_creator) {
    return { error: "Already a creator" };
  }

  // Update profile to creator
  const creatorUpdateData = {
    is_creator: true,
    updated_at: new Date().toISOString(),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("profiles") as any)
    .update(creatorUpdateData)
    .eq("id", user.id);

  if (error) {
    console.error("Error becoming creator:", error);
    return { error: "Failed to become creator" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/sell");
  return { success: true };
}
