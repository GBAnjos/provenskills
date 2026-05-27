"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Download,
  User,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Tag,
  CheckCircle,
  AlertTriangle,
  Terminal,
  Loader2,
  PackageCheck,
  ShoppingCart,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Badge } from "@/components/ui";
import { Spotlight, BackgroundGradient } from "@/components/ui/aceternity";
import { cn } from "@/lib/utils";
import { installFreeSkill, createReview } from "@/lib/actions";
import type { SkillWithDetails } from "@/lib/db/skills";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
      return "text-[var(--error)]";
    case "high":
      return "text-orange-500";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-[var(--proven-blue-500)]";
    default:
      return "text-muted";
  }
}

function getGradeColor(grade: string) {
  switch (grade) {
    case "A":
    case "A+":
      return "from-[var(--proven-green-500)] to-[var(--proven-green-700)]";
    case "B":
    case "B+":
      return "from-[var(--proven-blue-500)] to-[var(--proven-blue-700)]";
    case "C":
    case "C+":
      return "from-yellow-500 to-yellow-700";
    default:
      return "from-[var(--error)] to-red-700";
  }
}

interface SecurityCheck {
  name: string;
  passed: boolean;
  severity: string;
}

interface SkillDetailClientProps {
  skill: SkillWithDetails;
  isOwned: boolean;
  isLoggedIn: boolean;
  hasReviewed: boolean;
}

export function SkillDetailClient({ skill, isOwned, isLoggedIn, hasReviewed }: SkillDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [installSuccess, setInstallSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(hasReviewed);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText(skill.install_command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstall = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (skill.is_free) {
      startTransition(async () => {
        const result = await installFreeSkill(skill.id);
        if (result.error) {
          if (result.alreadyInstalled) {
            setInstallSuccess(true);
          } else {
            setError(result.error);
          }
        } else {
          setInstallSuccess(true);
          router.refresh();
        }
      });
    } else {
      // For paid skills, show coming soon or redirect to checkout
      setError("Paid purchases coming soon! Stripe integration in progress.");
    }
  };

  const handleSubmitReview = async () => {
    setReviewError(null);
    setIsSubmittingReview(true);

    const result = await createReview({
      skillId: skill.id,
      rating: reviewRating,
      comment: reviewComment || undefined,
    });

    setIsSubmittingReview(false);

    if (result.error) {
      setReviewError(result.error);
    } else {
      setReviewSubmitted(true);
      router.refresh();
    }
  };

  // Get security checks from the latest scan
  const latestScan = skill.security_scans?.[0];
  const securityChecks: SecurityCheck[] = latestScan?.checks
    ? (latestScan.checks as unknown as SecurityCheck[])
    : [];
  const passedChecks = securityChecks.filter((c) => c.passed).length;
  const totalChecks = securityChecks.length;

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
            {/* Back Link */}
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Skills
            </Link>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Info */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge
                      variant="success"
                      icon={<ShieldCheck className="h-3 w-3" />}
                    >
                      Security Grade: {skill.security_grade}
                    </Badge>
                    {skill.is_featured && (
                      <Badge variant="warning">Featured</Badge>
                    )}
                    {skill.category && (
                      <Badge variant="default">
                        {skill.category.icon} {skill.category.name}
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-4xl font-bold">{skill.name}</h1>
                  <p className="mt-4 text-lg text-muted">{skill.description}</p>

                  {/* Stats */}
                  <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">{Number(skill.rating).toFixed(1)}</span>
                      <span className="text-muted">({skill.review_count} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted">
                      <Download className="h-5 w-5" />
                      <span>{skill.downloads.toLocaleString()} downloads</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted">
                      <Clock className="h-5 w-5" />
                      <span>v{skill.version}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-card px-3 py-1 text-xs text-muted border border-border"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1"
              >
                <BackgroundGradient className="rounded-2xl">
                  <div className="rounded-2xl bg-card p-6 border border-border">
                    {/* Price */}
                    <div className="text-center mb-6">
                      {skill.is_free ? (
                        <p className="text-4xl font-bold text-[var(--proven-green-500)]">
                          FREE
                        </p>
                      ) : (
                        <p className="text-4xl font-bold">${Number(skill.price).toFixed(2)}</p>
                      )}
                      <p className="text-sm text-muted mt-1">One-time purchase</p>
                    </div>

                    {/* Install Command */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">
                        Install Command
                      </label>
                      <div className="flex items-center gap-2 rounded-lg bg-background border border-border p-3">
                        <Terminal className="h-4 w-4 text-muted shrink-0" />
                        <code className="flex-1 text-sm truncate">
                          {skill.install_command}
                        </code>
                        <button
                          onClick={handleCopy}
                          className="shrink-0 p-1 hover:bg-card rounded transition-colors"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-[var(--proven-green-500)]" />
                          ) : (
                            <Copy className="h-4 w-4 text-muted" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {error && (
                        <div className="rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20 p-3 text-sm text-[var(--error)]">
                          {error}
                        </div>
                      )}

                      {isOwned || installSuccess ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2 rounded-xl bg-[var(--proven-green-500)]/10 border border-[var(--proven-green-500)]/20 py-3 text-[var(--proven-green-500)] font-medium">
                            <PackageCheck className="h-5 w-5" />
                            Installed
                          </div>
                          <button
                            onClick={handleCopy}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 font-medium hover:bg-card transition-colors"
                          >
                            {copied ? (
                              <>
                                <Check className="h-4 w-4 text-[var(--proven-green-500)]" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Copy Install Command
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleInstall}
                          disabled={isPending}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--proven-green-500)] py-3 font-medium text-white hover:bg-[var(--proven-green-600)] transition-colors disabled:opacity-50"
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Installing...
                            </>
                          ) : skill.is_free ? (
                            <>
                              <Download className="h-4 w-4" />
                              Install Free
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4" />
                              Purchase ${Number(skill.price).toFixed(2)}
                            </>
                          )}
                        </button>
                      )}

                      {skill.github_url && (
                        <a
                          href={skill.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 font-medium hover:bg-card transition-colors"
                        >
                          <GithubIcon className="h-4 w-4" />
                          View Source
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>

                    {/* Creator */}
                    {skill.creator && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-sm text-muted mb-3">Created by</p>
                        <Link
                          href={`/creators/${skill.creator.username}`}
                          className="flex items-center gap-3 group"
                        >
                          {skill.creator.avatar_url ? (
                            <img
                              src={skill.creator.avatar_url}
                              alt={skill.creator.full_name || "Creator"}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--proven-green-500)]">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium group-hover:text-[var(--proven-green-500)] transition-colors">
                              {skill.creator.full_name || skill.creator.username}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-muted">
                              @{skill.creator.username}
                              {skill.creator.is_verified && (
                                <ShieldCheck className="h-3 w-3 text-[var(--proven-blue-500)]" />
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </BackgroundGradient>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Security Report */}
        {securityChecks.length > 0 && (
          <section className="py-12 border-b border-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold mb-6">Security Report</h2>

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Score Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-border bg-card p-6 text-center"
                >
                  <div
                    className={cn(
                      "mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br text-4xl font-bold text-white",
                      getGradeColor(skill.security_grade)
                    )}
                  >
                    {skill.security_grade}
                  </div>
                  <p className="mt-4 text-3xl font-bold">{latestScan?.overall_score || 0}/100</p>
                  <p className="text-muted">Security Score</p>
                  <p className="mt-4 text-sm text-muted">
                    {passedChecks}/{totalChecks} checks passed
                  </p>
                </motion.div>

                {/* Checks List */}
                <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-semibold mb-4">Security Checks</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {securityChecks.map((check, i) => (
                      <motion.div
                        key={check.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 rounded-lg bg-background p-3"
                      >
                        {check.passed ? (
                          <CheckCircle className="h-5 w-5 text-[var(--proven-green-500)] shrink-0" />
                        ) : (
                          <AlertTriangle className={cn("h-5 w-5 shrink-0", getSeverityColor(check.severity))} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{check.name}</p>
                          <p className={cn("text-xs capitalize", getSeverityColor(check.severity))}>
                            {check.severity}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Reviews</h2>
              <p className="text-muted">{skill.review_count} reviews</p>
            </div>

            {/* Review Form - Show only if user owns the skill and hasn't reviewed */}
            {(isOwned || installSuccess) && !reviewSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="font-semibold mb-4">Write a Review</h3>

                {reviewError && (
                  <div className="mb-4 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20 p-3 text-sm text-[var(--error)]">
                    {reviewError}
                  </div>
                )}

                {/* Star Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={cn(
                            "h-8 w-8 transition-colors",
                            star <= reviewRating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted hover:text-yellow-500"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Comment (optional)
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this skill..."
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-[var(--proven-green-500)] focus:outline-none focus:ring-1 focus:ring-[var(--proven-green-500)] resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                  className="flex items-center gap-2 rounded-xl bg-[var(--proven-green-500)] px-6 py-3 font-medium text-white hover:bg-[var(--proven-green-600)] transition-colors disabled:opacity-50"
                >
                  {isSubmittingReview ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4" />
                      Submit Review
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {reviewSubmitted && !hasReviewed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 rounded-2xl border border-[var(--proven-green-500)]/20 bg-[var(--proven-green-500)]/5 p-6 text-center"
              >
                <CheckCircle className="h-8 w-8 text-[var(--proven-green-500)] mx-auto mb-2" />
                <p className="font-medium">Thank you for your review!</p>
              </motion.div>
            )}

            {skill.reviews && skill.reviews.length > 0 ? (
              <div className="space-y-4">
                {skill.reviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {review.user?.avatar_url ? (
                          <img
                            src={review.user.avatar_url}
                            alt={review.user.full_name || "User"}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border">
                            <User className="h-5 w-5 text-muted" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{review.user?.full_name || "Anonymous"}</p>
                          <p className="text-sm text-muted">@{review.user?.username || "user"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < review.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="mt-4 text-muted">{review.comment}</p>
                    )}
                    <p className="mt-4 text-xs text-muted">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted">
                <Star className="h-10 w-10 mx-auto mb-3 text-muted" />
                <p>No reviews yet. Be the first to review this skill!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
