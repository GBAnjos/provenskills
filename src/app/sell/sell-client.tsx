"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  DollarSign,
  Tag,
  FileText,
  Terminal,
  ShieldCheck,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Badge, LinkButton } from "@/components/ui";
import { Spotlight, BackgroundGradient } from "@/components/ui/aceternity";
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Profile } from "@/lib/db/profiles";
import type { Category } from "@/lib/db/categories";

interface SellPageClientProps {
  user: SupabaseUser;
  profile: Profile | null;
  categories: Category[];
}

type Step = "info" | "pricing" | "details" | "review";

const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: "info", label: "Basic Info", icon: <Package className="h-4 w-4" /> },
  { id: "pricing", label: "Pricing", icon: <DollarSign className="h-4 w-4" /> },
  { id: "details", label: "Details", icon: <FileText className="h-4 w-4" /> },
  { id: "review", label: "Review", icon: <ShieldCheck className="h-4 w-4" /> },
];

export function SellPageClient({ user, profile, categories }: SellPageClientProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    isFree: true,
    installCommand: "",
    githubUrl: "",
    longDescription: "",
    tags: "",
  });

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call (will be replaced with actual Supabase insert)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // For now, just redirect to dashboard
    router.push("/dashboard");
  };

  // Check if user needs to become a creator first
  if (profile && !profile.is_creator) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md text-center"
          >
            <BackgroundGradient className="rounded-2xl">
              <div className="rounded-2xl bg-card p-8 border border-border">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--proven-green-500)]/10 mb-6">
                  <Sparkles className="h-8 w-8 text-[var(--proven-green-500)]" />
                </div>
                <h1 className="text-2xl font-bold">Become a Creator</h1>
                <p className="text-muted mt-4">
                  To sell skills on ProvenSkills, you need to apply for a creator account.
                  Creators earn <span className="text-[var(--proven-green-500)] font-semibold">80%</span> of every sale.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3 text-left">
                    <Check className="h-5 w-5 text-[var(--proven-green-500)] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Free security certification</p>
                      <p className="text-sm text-muted">
                        Every skill gets our 12-point security scan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <Check className="h-5 w-5 text-[var(--proven-green-500)] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Instant payouts</p>
                      <p className="text-sm text-muted">
                        Get paid directly to your Stripe account
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <Check className="h-5 w-5 text-[var(--proven-green-500)] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Analytics dashboard</p>
                      <p className="text-sm text-muted">
                        Track downloads, revenue, and reviews
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    // TODO: Implement creator application
                    alert("Creator applications coming soon!");
                  }}
                  className="w-full mt-8 rounded-xl bg-[var(--proven-green-500)] py-3 font-medium text-white hover:bg-[var(--proven-green-600)] transition-colors"
                >
                  Apply to Become a Creator
                </button>
              </div>
            </BackgroundGradient>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <Spotlight
            className="-top-40 left-0 md:-top-20 md:left-60"
            fill="var(--proven-green-500)"
          />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge
                variant="success"
                icon={<ShieldCheck className="h-3 w-3" />}
                className="mb-4"
              >
                Free Security Certification Included
              </Badge>
              <h1 className="text-4xl font-bold">Create a New Skill</h1>
              <p className="mt-2 text-muted">
                Share your AI skill with the community and earn 80% of every sale.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps Progress */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => {
                      if (index <= currentStepIndex) {
                        setCurrentStep(step.id);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      step.id === currentStep
                        ? "bg-[var(--proven-green-500)] text-white"
                        : index < currentStepIndex
                        ? "bg-[var(--proven-green-500)]/10 text-[var(--proven-green-500)]"
                        : "text-muted"
                    )}
                    disabled={index > currentStepIndex}
                  >
                    {step.icon}
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "mx-2 h-0.5 w-8 sm:w-16",
                        index < currentStepIndex
                          ? "bg-[var(--proven-green-500)]"
                          : "bg-border"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              {currentStep === "info" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">Basic Information</h2>
                    <p className="text-muted mt-1">
                      Tell us about your skill
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Skill Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      placeholder="e.g., SEO Audit Pro"
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-[var(--proven-green-500)] focus:outline-none focus:ring-1 focus:ring-[var(--proven-green-500)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Short Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateFormData("description", e.target.value)}
                      placeholder="Describe what your skill does in 1-2 sentences"
                      rows={3}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-[var(--proven-green-500)] focus:outline-none focus:ring-1 focus:ring-[var(--proven-green-500)] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => updateFormData("categoryId", e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-[var(--proven-green-500)] focus:outline-none"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {currentStep === "pricing" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">Pricing</h2>
                    <p className="text-muted mt-1">
                      Set your pricing model. You earn 80% of every sale.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateFormData("isFree", true);
                        updateFormData("price", "0");
                      }}
                      className={cn(
                        "rounded-xl border-2 p-6 text-left transition-colors",
                        formData.isFree
                          ? "border-[var(--proven-green-500)] bg-[var(--proven-green-500)]/5"
                          : "border-border hover:border-[var(--proven-green-500)]/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-[var(--proven-green-500)]">
                          FREE
                        </span>
                        {formData.isFree && (
                          <Check className="h-5 w-5 text-[var(--proven-green-500)]" />
                        )}
                      </div>
                      <p className="mt-2 text-sm text-muted">
                        Great for building your reputation and getting downloads
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateFormData("isFree", false)}
                      className={cn(
                        "rounded-xl border-2 p-6 text-left transition-colors",
                        !formData.isFree
                          ? "border-[var(--proven-green-500)] bg-[var(--proven-green-500)]/5"
                          : "border-border hover:border-[var(--proven-green-500)]/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">Paid</span>
                        {!formData.isFree && (
                          <Check className="h-5 w-5 text-[var(--proven-green-500)]" />
                        )}
                      </div>
                      <p className="mt-2 text-sm text-muted">
                        Earn 80% of every sale. Minimum price: $4.99
                      </p>
                    </button>
                  </div>

                  {!formData.isFree && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Price (USD)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => updateFormData("price", e.target.value)}
                          min="4.99"
                          step="0.01"
                          placeholder="9.99"
                          className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-sm focus:border-[var(--proven-green-500)] focus:outline-none focus:ring-1 focus:ring-[var(--proven-green-500)]"
                        />
                      </div>
                      {formData.price && Number(formData.price) > 0 && (
                        <p className="mt-2 text-sm text-muted">
                          You will earn{" "}
                          <span className="font-semibold text-[var(--proven-green-500)]">
                            ${(Number(formData.price) * 0.8).toFixed(2)}
                          </span>{" "}
                          per sale
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {currentStep === "details" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">Technical Details</h2>
                    <p className="text-muted mt-1">
                      Provide installation instructions and documentation
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Install Command *
                    </label>
                    <div className="relative">
                      <Terminal className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      <input
                        type="text"
                        value={formData.installCommand}
                        onChange={(e) => updateFormData("installCommand", e.target.value)}
                        placeholder="claude skill install @username/skill-name"
                        className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-sm font-mono focus:border-[var(--proven-green-500)] focus:outline-none focus:ring-1 focus:ring-[var(--proven-green-500)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      GitHub URL (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => updateFormData("githubUrl", e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-[var(--proven-green-500)] focus:outline-none focus:ring-1 focus:ring-[var(--proven-green-500)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Description (Markdown supported)
                    </label>
                    <textarea
                      value={formData.longDescription}
                      onChange={(e) => updateFormData("longDescription", e.target.value)}
                      placeholder="Detailed description of your skill, features, usage examples..."
                      rows={8}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm font-mono focus:border-[var(--proven-green-500)] focus:outline-none focus:ring-1 focus:ring-[var(--proven-green-500)] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tags (comma separated)
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => updateFormData("tags", e.target.value)}
                        placeholder="seo, marketing, audit"
                        className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-sm focus:border-[var(--proven-green-500)] focus:outline-none focus:ring-1 focus:ring-[var(--proven-green-500)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "review" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">Review & Submit</h2>
                    <p className="text-muted mt-1">
                      Review your skill details before submitting for security review
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted">Name</span>
                      <span className="font-medium">{formData.name || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Category</span>
                      <span className="font-medium">
                        {categories.find((c) => c.id === formData.categoryId)?.name || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Price</span>
                      <span className="font-medium">
                        {formData.isFree ? "Free" : `$${formData.price}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Install Command</span>
                      <code className="text-sm">{formData.installCommand || "—"}</code>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[var(--proven-green-500)]/20 bg-[var(--proven-green-500)]/5 p-6">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="h-6 w-6 text-[var(--proven-green-500)] shrink-0" />
                      <div>
                        <p className="font-medium">Security Review</p>
                        <p className="text-sm text-muted mt-1">
                          Your skill will undergo our 12-point security certification process.
                          This typically takes less than 24 hours. You&apos;ll be notified when your
                          skill is approved and live.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <button
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    currentStepIndex === 0
                      ? "text-muted cursor-not-allowed"
                      : "text-foreground hover:bg-card"
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                {currentStep === "review" ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-[var(--proven-green-500)] px-6 py-3 font-medium text-white hover:bg-[var(--proven-green-600)] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit for Review
                        <ShieldCheck className="h-4 w-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 rounded-xl bg-[var(--proven-green-500)] px-6 py-3 font-medium text-white hover:bg-[var(--proven-green-600)] transition-colors"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
