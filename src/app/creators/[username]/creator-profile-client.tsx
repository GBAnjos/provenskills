"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Globe,
  Star,
  Package,
  Download,
  DollarSign,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Badge } from "@/components/ui";
import { SkillCard } from "@/components/skills";
import { Spotlight } from "@/components/ui/aceternity";
import type { Profile } from "@/lib/db/profiles";
import type { SkillWithRelations } from "@/lib/db/skills";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface CreatorProfileClientProps {
  profile: Profile;
  skills: SkillWithRelations[];
}

export function CreatorProfileClient({ profile, skills }: CreatorProfileClientProps) {
  const totalDownloads = skills.reduce((acc, skill) => acc + skill.downloads, 0);
  const averageRating = skills.length > 0
    ? skills.reduce((acc, skill) => acc + Number(skill.rating), 0) / skills.length
    : 0;
  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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
              href="/creators"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Creators
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-start gap-8"
            >
              {/* Avatar */}
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--proven-green-500)] to-[var(--proven-green-600)] text-5xl font-bold text-white shrink-0">
                {profile.username?.[0]?.toUpperCase() || "?"}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-bold">{profile.full_name || profile.username}</h1>
                  {profile.is_verified && (
                    <Badge variant="success" icon={<BadgeCheck className="h-3 w-3" />}>
                      Verified Creator
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-muted mt-1">@{profile.username}</p>

                {profile.bio && (
                  <p className="mt-4 text-muted max-w-2xl">{profile.bio}</p>
                )}

                {/* Social Links */}
                <div className="mt-4 flex items-center gap-4">
                  {profile.website_url && (
                    <a
                      href={profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted hover:text-[var(--proven-green-500)] transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted hover:text-[var(--proven-green-500)] transition-colors"
                    >
                      <GithubIcon className="h-4 w-4" />
                      GitHub
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {profile.twitter_url && (
                    <a
                      href={profile.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted hover:text-[var(--proven-green-500)] transition-colors"
                    >
                      <TwitterIcon className="h-4 w-4" />
                      Twitter
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-6 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--proven-green-500)]" />
                    <span className="font-semibold">{skills.length}</span>
                    <span className="text-muted">Skills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-[var(--proven-green-500)]" />
                    <span className="font-semibold">{totalDownloads.toLocaleString()}</span>
                    <span className="text-muted">Downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="text-muted">Avg Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[var(--proven-green-500)]" />
                    <span className="font-semibold">{profile.total_sales}</span>
                    <span className="text-muted">Sales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted" />
                    <span className="text-muted">Joined {joinDate}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Skills */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">
              Published Skills ({skills.length})
            </h2>

            {skills.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {skills.map((skill, index) => (
                  <SkillCard key={skill.id} skill={skill} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted mx-auto" />
                <p className="mt-4 text-muted">No published skills yet</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
