"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  ShieldCheck,
  Package,
  Settings,
  Plus,
  Star,
  Download,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Loader2,
  Check,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Badge, LinkButton } from "@/components/ui";
import { SkillCard } from "@/components/skills";
import { Spotlight, BackgroundGradient } from "@/components/ui/aceternity";
import { cn } from "@/lib/utils";
import { updateProfile, becomeCreator } from "@/lib/actions";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Profile } from "@/lib/db/profiles";
import type { SkillWithRelations } from "@/lib/db/skills";

interface DashboardClientProps {
  user: SupabaseUser;
  profile: Profile;
  creatorSkills: SkillWithRelations[];
  purchases: any[];
}

type TabType = "overview" | "skills" | "purchases" | "settings";

export function DashboardClient({
  user,
  profile,
  creatorSkills,
  purchases,
}: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state for settings
  const [formData, setFormData] = useState({
    username: profile.username || "",
    full_name: profile.full_name || "",
    bio: profile.bio || "",
    website_url: profile.website_url || "",
    github_url: profile.github_url || "",
    twitter_url: profile.twitter_url || "",
  });

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <TrendingUp className="h-4 w-4" /> },
    ...(profile.is_creator
      ? [{ id: "skills" as TabType, label: "My Skills", icon: <Package className="h-4 w-4" /> }]
      : []),
    { id: "purchases", label: "Purchases", icon: <Download className="h-4 w-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  // Calculate stats
  const totalDownloads = creatorSkills.reduce((sum, skill) => sum + skill.downloads, 0);
  const totalEarnings = profile.total_earnings || 0;
  const avgRating =
    creatorSkills.length > 0
      ? creatorSkills.reduce((sum, skill) => sum + Number(skill.rating), 0) / creatorSkills.length
      : 0;

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateProfile(formData);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        router.refresh();
      }
    });
  };

  const handleBecomeCreator = async () => {
    setMessage(null);

    startTransition(async () => {
      const result = await becomeCreator();

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "You are now a creator!" });
        router.refresh();
      }
    });
  };

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || "User"}
                    className="h-20 w-20 rounded-full border-4 border-[var(--proven-green-500)]/20"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--proven-green-500)] border-4 border-[var(--proven-green-500)]/20">
                    <User className="h-10 w-10 text-white" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">
                      {profile.full_name || profile.username || "User"}
                    </h1>
                    {profile.is_verified && (
                      <ShieldCheck className="h-5 w-5 text-[var(--proven-blue-500)]" />
                    )}
                  </div>
                  <p className="text-muted">@{profile.username || user.email?.split("@")[0]}</p>
                  {profile.is_creator && (
                    <Badge variant="success" className="mt-2">
                      Creator
                    </Badge>
                  )}
                </div>
              </div>

              {profile.is_creator && (
                <LinkButton
                  href="/sell"
                  variant="primary"
                  className="rounded-full"
                  endContent={<Plus className="h-4 w-4" />}
                >
                  Create New Skill
                </LinkButton>
              )}
            </div>
          </div>
        </section>

        {/* Tabs & Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-border pb-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-[var(--proven-green-500)] text-white"
                      : "text-muted hover:bg-card hover:text-foreground"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-8">
              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Stats Grid */}
                  {profile.is_creator && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--proven-green-500)]/10">
                            <Package className="h-6 w-6 text-[var(--proven-green-500)]" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{creatorSkills.length}</p>
                            <p className="text-sm text-muted">Published Skills</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--proven-blue-500)]/10">
                            <Download className="h-6 w-6 text-[var(--proven-blue-500)]" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{totalDownloads.toLocaleString()}</p>
                            <p className="text-sm text-muted">Total Downloads</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10">
                            <Star className="h-6 w-6 text-yellow-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">
                              {avgRating > 0 ? avgRating.toFixed(1) : "N/A"}
                            </p>
                            <p className="text-sm text-muted">Avg Rating</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--proven-green-500)]/10">
                            <DollarSign className="h-6 w-6 text-[var(--proven-green-500)]" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">${Number(totalEarnings).toFixed(2)}</p>
                            <p className="text-sm text-muted">Total Earnings</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Activity */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                    {creatorSkills.length === 0 && purchases.length === 0 ? (
                      <div className="rounded-2xl border border-border bg-card p-12 text-center">
                        <Package className="h-12 w-12 text-muted mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">No activity yet</h3>
                        <p className="text-muted mt-2">
                          {profile.is_creator
                            ? "Create your first skill to get started!"
                            : "Browse and purchase skills to see them here."}
                        </p>
                        <LinkButton
                          href={profile.is_creator ? "/sell" : "/skills"}
                          variant="primary"
                          className="mt-4"
                        >
                          {profile.is_creator ? "Create a Skill" : "Browse Skills"}
                        </LinkButton>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {creatorSkills.slice(0, 3).map((skill, index) => (
                          <SkillCard key={skill.id} skill={skill} index={index} />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "skills" && profile.is_creator && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {creatorSkills.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-card p-12 text-center">
                      <Package className="h-12 w-12 text-muted mx-auto mb-4" />
                      <h3 className="text-lg font-semibold">No skills yet</h3>
                      <p className="text-muted mt-2">
                        Create your first skill to start earning.
                      </p>
                      <LinkButton href="/sell" variant="primary" className="mt-4">
                        Create a Skill
                      </LinkButton>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {creatorSkills.map((skill, index) => (
                        <SkillCard key={skill.id} skill={skill} index={index} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "purchases" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {purchases.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-card p-12 text-center">
                      <Download className="h-12 w-12 text-muted mx-auto mb-4" />
                      <h3 className="text-lg font-semibold">No purchases yet</h3>
                      <p className="text-muted mt-2">
                        Skills you purchase will appear here.
                      </p>
                      <LinkButton href="/skills" variant="primary" className="mt-4">
                        Browse Skills
                      </LinkButton>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {purchases.map((purchase: any) => (
                        <div
                          key={purchase.id}
                          className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--proven-green-500)]/10">
                              <Package className="h-6 w-6 text-[var(--proven-green-500)]" />
                            </div>
                            <div>
                              <p className="font-semibold">{purchase.skill?.name}</p>
                              <p className="text-sm text-muted">
                                Purchased {new Date(purchase.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted">
                              ${Number(purchase.price_paid).toFixed(2)}
                            </span>
                            <Link
                              href={`/skills/${purchase.skill?.slug}`}
                              className="flex items-center gap-1 text-sm text-[var(--proven-green-500)] hover:underline"
                            >
                              View
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl"
                >
                  <BackgroundGradient className="rounded-2xl">
                    <div className="rounded-2xl bg-card p-6 border border-border">
                      <h2 className="text-xl font-bold mb-6">Profile Settings</h2>

                      {message && (
                        <div
                          className={cn(
                            "mb-6 rounded-lg p-4 text-sm",
                            message.type === "success"
                              ? "bg-[var(--proven-green-500)]/10 text-[var(--proven-green-500)] border border-[var(--proven-green-500)]/20"
                              : "bg-[var(--error)]/10 text-[var(--error)] border border-[var(--error)]/20"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {message.type === "success" ? (
                              <Check className="h-4 w-4" />
                            ) : null}
                            {message.text}
                          </div>
                        </div>
                      )}

                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <input
                            type="email"
                            value={user.email || ""}
                            disabled
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted"
                          />
                          <p className="mt-1 text-xs text-muted">
                            Email cannot be changed
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Username</label>
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-[var(--proven-green-500)] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name</label>
                          <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-[var(--proven-green-500)] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Bio</label>
                          <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={3}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-[var(--proven-green-500)] focus:outline-none resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Website URL</label>
                          <input
                            type="url"
                            value={formData.website_url}
                            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                            placeholder="https://yourwebsite.com"
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-[var(--proven-green-500)] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">GitHub URL</label>
                          <input
                            type="url"
                            value={formData.github_url}
                            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                            placeholder="https://github.com/username"
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-[var(--proven-green-500)] focus:outline-none"
                          />
                        </div>

                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center gap-2 rounded-lg bg-[var(--proven-green-500)] px-6 py-2 text-sm font-medium text-white hover:bg-[var(--proven-green-600)] transition-colors disabled:opacity-50"
                          >
                            {isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </button>
                        </div>
                      </form>

                      {!profile.is_creator && (
                        <div className="mt-8 pt-8 border-t border-border">
                          <h3 className="font-semibold mb-2">Become a Creator</h3>
                          <p className="text-sm text-muted mb-4">
                            Start selling your AI skills and earn 80% of every sale.
                          </p>
                          <button
                            onClick={handleBecomeCreator}
                            disabled={isPending}
                            className="flex items-center gap-2 rounded-lg border border-[var(--proven-green-500)] px-4 py-2 text-sm font-medium text-[var(--proven-green-500)] hover:bg-[var(--proven-green-500)]/10 transition-colors disabled:opacity-50"
                          >
                            {isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Become a Creator"
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </BackgroundGradient>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
