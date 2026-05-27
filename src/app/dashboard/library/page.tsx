import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserPurchases } from "@/lib/actions";
import { LibraryClient } from "./library-client";
import { Header, Footer } from "@/components/layout";

function LibraryLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--proven-green-500)] border-t-transparent mx-auto" />
          <p className="mt-4 text-muted">Loading your library...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

async function LibraryData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { purchases } = await getUserPurchases();

  return <LibraryClient purchases={purchases} />;
}

export default async function LibraryPage() {
  return (
    <Suspense fallback={<LibraryLoading />}>
      <LibraryData />
    </Suspense>
  );
}
