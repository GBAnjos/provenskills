"use server";

import { createClient } from "@/lib/supabase/server";

export interface SearchResult {
  type: "skill" | "creator";
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  extra?: string;
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  const supabase = await createClient();
  const results: SearchResult[] = [];

  // Search skills
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: skills } = await (supabase.from("skills") as any)
    .select("id, name, slug, description, category:categories(icon)")
    .eq("is_published", true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(5);

  if (skills) {
    for (const skill of skills) {
      results.push({
        type: "skill",
        id: skill.id,
        name: skill.name,
        slug: skill.slug,
        description: skill.description,
        image: skill.category?.icon,
        extra: "Skill",
      });
    }
  }

  // Search creators
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: creators } = await (supabase.from("profiles") as any)
    .select("id, username, full_name, bio, avatar_url")
    .eq("is_creator", true)
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
    .limit(5);

  if (creators) {
    for (const creator of creators) {
      results.push({
        type: "creator",
        id: creator.id,
        name: creator.full_name || creator.username,
        slug: creator.username,
        description: creator.bio || "Creator on ProvenSkills",
        image: creator.avatar_url,
        extra: "Creator",
      });
    }
  }

  return results;
}
