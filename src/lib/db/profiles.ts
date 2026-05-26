import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type Profile = Tables<"profiles">;
export type ProfileUpdate = Partial<Omit<Profile, "id" | "created_at">>;

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

export async function getProfileByUsername(
  username: string
): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

// Note: updateProfile will be implemented when needed for dashboard
// Skipping for now due to Supabase type inference issues

export async function getCreators(limit = 10): Promise<Profile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_creator", true)
    .order("total_sales", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching creators:", error);
    return [];
  }

  return data;
}

export async function getVerifiedCreators(limit = 10): Promise<Profile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_creator", true)
    .eq("is_verified", true)
    .order("total_sales", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching verified creators:", error);
    return [];
  }

  return data;
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    console.error("Error checking username:", error);
    return false;
  }

  return data === null;
}
