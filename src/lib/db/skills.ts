import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type SkillWithRelations = Tables<"skills"> & {
  category: Tables<"categories"> | null;
  creator: Tables<"profiles"> | null;
};

export type SkillWithDetails = SkillWithRelations & {
  security_scans: Tables<"security_scans">[];
  reviews: (Tables<"reviews"> & {
    user: Tables<"profiles"> | null;
  })[];
};

export interface GetSkillsOptions {
  category?: string;
  search?: string;
  priceFilter?: "all" | "free" | "paid" | "under-10" | "under-25";
  securityGrade?: "all" | "a" | "b" | "c";
  sort?: "popular" | "newest" | "rating" | "price-low" | "price-high";
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export async function getSkills(options: GetSkillsOptions = {}): Promise<SkillWithRelations[]> {
  const supabase = await createClient();

  // Build the query
  let queryBuilder = supabase
    .from("skills")
    .select(
      `
      *,
      category:categories(*),
      creator:profiles(*)
    `
    )
    .eq("is_published", true);

  // Category filter
  if (options.category && options.category !== "all") {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.category)
      .single();

    if (categoryData) {
      const catId = (categoryData as { id: string }).id;
      queryBuilder = queryBuilder.eq("category_id", catId);
    }
  }

  // Search filter
  if (options.search) {
    queryBuilder = queryBuilder.or(
      `name.ilike.%${options.search}%,description.ilike.%${options.search}%`
    );
  }

  // Price filter
  if (options.priceFilter && options.priceFilter !== "all") {
    switch (options.priceFilter) {
      case "free":
        queryBuilder = queryBuilder.eq("is_free", true);
        break;
      case "paid":
        queryBuilder = queryBuilder.eq("is_free", false);
        break;
      case "under-10":
        queryBuilder = queryBuilder.lt("price", 10);
        break;
      case "under-25":
        queryBuilder = queryBuilder.lt("price", 25);
        break;
    }
  }

  // Security grade filter
  if (options.securityGrade && options.securityGrade !== "all") {
    queryBuilder = queryBuilder.ilike("security_grade", `${options.securityGrade}%`);
  }

  // Featured filter
  if (options.featured) {
    queryBuilder = queryBuilder.eq("is_featured", true);
  }

  // Sorting
  switch (options.sort) {
    case "newest":
      queryBuilder = queryBuilder.order("created_at", { ascending: false });
      break;
    case "rating":
      queryBuilder = queryBuilder.order("rating", { ascending: false });
      break;
    case "price-low":
      queryBuilder = queryBuilder.order("price", { ascending: true });
      break;
    case "price-high":
      queryBuilder = queryBuilder.order("price", { ascending: false });
      break;
    case "popular":
    default:
      queryBuilder = queryBuilder.order("downloads", { ascending: false });
      break;
  }

  // Pagination
  if (options.limit) {
    queryBuilder = queryBuilder.limit(options.limit);
  }
  if (options.offset) {
    queryBuilder = queryBuilder.range(options.offset, options.offset + (options.limit || 20) - 1);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error("Error fetching skills:", error);
    return [];
  }

  return (data || []) as SkillWithRelations[];
}

export async function getSkillBySlug(slug: string): Promise<SkillWithDetails | null> {
  const supabase = await createClient();

  const { data: skill, error } = await supabase
    .from("skills")
    .select(
      `
      *,
      category:categories(*),
      creator:profiles(*),
      security_scans(*),
      reviews(
        *,
        user:profiles(*)
      )
    `
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error("Error fetching skill:", error);
    return null;
  }

  return skill as unknown as SkillWithDetails;
}

export async function getFeaturedSkills(limit = 6): Promise<SkillWithRelations[]> {
  return getSkills({ featured: true, limit });
}

export async function getSkillsByCreator(creatorId: string): Promise<SkillWithRelations[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("skills")
    .select(
      `
      *,
      category:categories(*),
      creator:profiles(*)
    `
    )
    .eq("creator_id", creatorId)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching creator skills:", error);
    return [];
  }

  return (data || []) as SkillWithRelations[];
}
