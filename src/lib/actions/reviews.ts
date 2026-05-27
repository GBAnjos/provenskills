"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CreateReviewData {
  skillId: string;
  rating: number;
  comment?: string;
}

export async function createReview(data: CreateReviewData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to leave a review" };
  }

  // Validate rating
  if (data.rating < 1 || data.rating > 5) {
    return { error: "Rating must be between 1 and 5" };
  }

  // Check if user owns/installed the skill
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: purchase } = await (supabase.from("purchases") as any)
    .select("id")
    .eq("skill_id", data.skillId)
    .eq("user_id", user.id)
    .eq("status", "completed")
    .maybeSingle();

  if (!purchase) {
    return { error: "You must install this skill before reviewing" };
  }

  // Check if user already reviewed this skill
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existingReview } = await (supabase.from("reviews") as any)
    .select("id")
    .eq("skill_id", data.skillId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingReview) {
    return { error: "You have already reviewed this skill" };
  }

  // Create the review
  const reviewData = {
    skill_id: data.skillId,
    user_id: user.id,
    rating: data.rating,
    comment: data.comment || null,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: reviewError } = await (supabase.from("reviews") as any)
    .insert(reviewData);

  if (reviewError) {
    console.error("Error creating review:", reviewError);
    return { error: "Failed to create review" };
  }

  // Update skill's average rating and review count
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allReviews } = await (supabase.from("reviews") as any)
    .select("rating")
    .eq("skill_id", data.skillId);

  if (allReviews && allReviews.length > 0) {
    const avgRating = allReviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / allReviews.length;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("skills") as any)
      .update({
        rating: avgRating,
        review_count: allReviews.length,
      })
      .eq("id", data.skillId);
  }

  revalidatePath(`/skills`);

  return { success: true };
}

export async function getUserReviewForSkill(skillId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { review: null };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: review } = await (supabase.from("reviews") as any)
    .select("*")
    .eq("skill_id", skillId)
    .eq("user_id", user.id)
    .maybeSingle();

  return { review };
}
