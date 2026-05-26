import { Suspense } from "react";
import { getCreators } from "@/lib/db";
import { CreatorsPageClient } from "./creators-client";
import { Header, Footer } from "@/components/layout";

function CreatorsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--proven-green-500)] border-t-transparent mx-auto" />
          <p className="mt-4 text-muted">Loading creators...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

async function CreatorsData() {
  const creators = await getCreators(100);

  return <CreatorsPageClient creators={creators} />;
}

export default async function CreatorsPage() {
  return (
    <Suspense fallback={<CreatorsLoading />}>
      <CreatorsData />
    </Suspense>
  );
}
