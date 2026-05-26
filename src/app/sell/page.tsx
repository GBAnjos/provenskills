import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getCategories } from "@/lib/db";
import { SellPageClient } from "./sell-client";

export default async function SellPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // User must be logged in
  if (!user) {
    redirect("/login?next=/sell");
  }

  const profile = await getProfile(user.id);
  const categories = await getCategories();

  return <SellPageClient user={user} profile={profile} categories={categories} />;
}
