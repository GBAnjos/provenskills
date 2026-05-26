import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type Category = Tables<"categories">;

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return data;
}

export async function getCategoriesWithCounts(): Promise<
  (Category & { skill_count: number })[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("skill_count", { ascending: false });

  if (error) {
    console.error("Error fetching categories with counts:", error);
    return [];
  }

  return data;
}
