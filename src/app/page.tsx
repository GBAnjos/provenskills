"use client";

import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  Lock,
  Eye,
  Terminal,
  Star,
  Download,
  Sparkles,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Badge, LinkButton } from "@/components/ui";
import {
  Spotlight,
  BackgroundGradient,
  BentoGrid,
  BentoGridItem,
  HoverEffect,
  SparklesText,
} from "@/components/ui/aceternity";
import { motion } from "framer-motion";

const stats = [
  { label: "Skills Verified", value: "500+", icon: ShieldCheck },
  { label: "Security Checks", value: "12-Point", icon: Lock },
  { label: "Creator Revenue", value: "80%", icon: Users },
  { label: "Install Time", value: "<1s", icon: Zap },
];

const securityChecks = [
  "Prompt Injection Detection",
  "Data Exfiltration Patterns",
  "Hardcoded Secrets/API Keys",
  "Dangerous Shell Commands",
  "Obfuscated Code Detection",
  "External URL Fetches",
  "Credential Access Patterns",
  "Privilege Escalation",
  "Dependency Vulnerabilities",
  "License Compliance",
  "Sandbox Behavior Test",
  "AI Content Analysis",
];

const featuredSkills = [
  {
    title: "SEO Audit Pro",
    description: "Comprehensive SEO analysis with actionable recommendations for your website.",
    link: "/skills/seo-audit-pro",
    icon: <Badge size="sm" variant="success" icon={<ShieldCheck className="h-3 w-3" />}>A</Badge>,
    badge: <span className="text-sm font-medium">$14.99</span>,
    footer: (
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span>4.9</span>
        </div>
        <div className="flex items-center gap-1 text-muted">
          <Download className="h-4 w-4" />
          <span>2,340</span>
        </div>
      </div>
    ),
  },
  {
    title: "API Documentation",
    description: "Auto-generate beautiful API docs from your OpenAPI specs or code.",
    link: "/skills/api-documentation",
    icon: <Badge size="sm" variant="success" icon={<ShieldCheck className="h-3 w-3" />}>A</Badge>,
    badge: <span className="text-sm font-medium text-[var(--proven-green-500)]">FREE</span>,
    footer: (
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span>4.7</span>
        </div>
        <div className="flex items-center gap-1 text-muted">
          <Download className="h-4 w-4" />
          <span>5,621</span>
        </div>
      </div>
    ),
  },
  {
    title: "Test Generator",
    description: "Generate unit tests, integration tests, and e2e tests from your code.",
    link: "/skills/test-generator",
    icon: <Badge size="sm" variant="success" icon={<ShieldCheck className="h-3 w-3" />}>A+</Badge>,
    badge: <span className="text-sm font-medium">$19.99</span>,
    footer: (
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span>5.0</span>
        </div>
        <div className="flex items-center gap-1 text-muted">
          <Download className="h-4 w-4" />
          <span>1,892</span>
        </div>
      </div>
    ),
  },
  {
    title: "Code Review AI",
    description: "AI-powered code review that catches bugs, security issues, and style problems.",
    link: "/skills/code-review-ai",
    icon: <Badge size="sm" variant="info" icon={<ShieldCheck className="h-3 w-3" />}>B+</Badge>,
    badge: <span className="text-sm font-medium">$24.99</span>,
    footer: (
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span>4.8</span>
        </div>
        <div className="flex items-center gap-1 text-muted">
          <Download className="h-4 w-4" />
          <span>3,104</span>
        </div>
      </div>
    ),
  },
  {
    title: "Database Schema",
    description: "Design and visualize database schemas with AI-powered suggestions.",
    link: "/skills/database-schema",
    icon: <Badge size="sm" variant="success" icon={<ShieldCheck className="h-3 w-3" />}>A</Badge>,
    badge: <span className="text-sm font-medium">$9.99</span>,
    footer: (
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span>4.6</span>
        </div>
        <div className="flex items-center gap-1 text-muted">
          <Download className="h-4 w-4" />
          <span>987</span>
        </div>
      </div>
    ),
  },
  {
    title: "Regex Builder",
    description: "Build and test complex regular expressions with natural language.",
    link: "/skills/regex-builder",
    icon: <Badge size="sm" variant="success" icon={<ShieldCheck className="h-3 w-3" />}>A</Badge>,
    badge: <span className="text-sm font-medium text-[var(--proven-green-500)]">FREE</span>,
    footer: (
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span>4.9</span>
        </div>
        <div className="flex items-center gap-1 text-muted">
          <Download className="h-4 w-4" />
          <span>4,230</span>
        </div>
      </div>
    ),
  },
];

const categories = [
  { name: "Frontend", count: 89, icon: "🎨", slug: "frontend" },
  { name: "Backend", count: 124, icon: "⚙️", slug: "backend" },
  { name: "DevOps", count: 67, icon: "🚀", slug: "devops" },
  { name: "Testing", count: 93, icon: "🧪", slug: "testing" },
  { name: "AI/ML", count: 45, icon: "🤖", slug: "ai-ml" },
  { name: "Data", count: 78, icon: "📊", slug: "data" },
  { name: "Security", count: 34, icon: "🔒", slug: "security" },
  { name: "Docs", count: 56, icon: "📝", slug: "documentation" },
];

const securityFeatures = [
  {
    title: "12-Point Security Certification",
    description: "Every skill passes our comprehensive security scan before it's listed.",
    header: (
      <div className="flex flex-wrap gap-2 p-4">
        {securityChecks.slice(0, 6).map((check, i) => (
          <div key={i} className="flex items-center gap-1 text-xs">
            <CheckCircle className="h-3 w-3 text-[var(--proven-green-500)]" />
            <span>{check}</span>
          </div>
        ))}
      </div>
    ),
    icon: <ShieldCheck className="h-4 w-4 text-[var(--proven-green-500)]" />,
    className: "md:col-span-2",
  },
  {
    title: "Transparent Scanning",
    description: "Every skill shows its full security report. No hidden issues, no surprises.",
    header: (
      <div className="flex h-full min-h-[6rem] w-full items-center justify-center rounded-xl bg-gradient-to-br from-[var(--proven-green-500)]/10 to-[var(--proven-blue-500)]/10">
        <Eye className="h-12 w-12 text-[var(--proven-green-500)]" />
      </div>
    ),
    icon: <Eye className="h-4 w-4 text-[var(--proven-green-500)]" />,
  },
  {
    title: "Verified Creators",
    description: "All creators pass identity verification. Know who built your tools.",
    header: (
      <div className="flex h-full min-h-[6rem] w-full items-center justify-center rounded-xl bg-gradient-to-br from-[var(--proven-blue-500)]/10 to-[var(--proven-green-500)]/10">
        <Users className="h-12 w-12 text-[var(--proven-blue-500)]" />
      </div>
    ),
    icon: <Users className="h-4 w-4 text-[var(--proven-blue-500)]" />,
  },
  {
    title: "Sandbox Testing",
    description: "Skills run in isolated environments before approval. Behavior is monitored.",
    header: (
      <div className="flex h-full min-h-[6rem] w-full items-center justify-center rounded-xl bg-gradient-to-br from-[var(--proven-green-500)]/10 to-[var(--proven-blue-500)]/10">
        <Terminal className="h-12 w-12 text-[var(--proven-green-500)]" />
      </div>
    ),
    icon: <Terminal className="h-4 w-4 text-[var(--proven-green-500)]" />,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <Spotlight
            className="-top-40 left-0 md:-top-20 md:left-60"
            fill="var(--proven-green-500)"
          />

          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Badge
                variant="success"
                icon={<Sparkles className="h-3 w-3" />}
                className="mb-6"
              >
                Every skill is security-certified
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                The{" "}
                <SparklesText className="inline">
                  <span className="gradient-text">Secure</span>
                </SparklesText>{" "}
                AI Skills
                <br />
                Marketplace
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl">
                The only marketplace for AI agent skills with enterprise-grade
                security certification.{" "}
                <span className="text-foreground font-medium">
                  Every skill passes our 12-point security scan
                </span>{" "}
                before you install.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <BackgroundGradient className="rounded-full">
                  <LinkButton
                    href="/skills"
                    size="lg"
                    variant="primary"
                    className="px-8 rounded-full"
                    endContent={<ArrowRight className="h-4 w-4" />}
                  >
                    Browse Skills
                  </LinkButton>
                </BackgroundGradient>
                <LinkButton
                  href="/sell"
                  size="lg"
                  variant="outline"
                  className="px-8 rounded-full"
                >
                  Start Selling
                </LinkButton>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="group rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-[var(--proven-green-500)]/50 hover:bg-card"
                  >
                    <stat.icon className="mx-auto h-8 w-8 text-[var(--proven-green-500)] transition-transform group-hover:scale-110" />
                    <p className="mt-3 text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Why Security Matters - Bento Grid */}
        <section className="border-t border-border py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Why Security Matters
              </h2>
              <p className="mt-4 text-lg text-muted">
                Other marketplaces have{" "}
                <span className="text-[var(--error)] font-semibold">
                  6.3 security issues per skill on average
                </span>
                . We scan everything.
              </p>
            </div>

            <BentoGrid>
              {securityFeatures.map((feature, i) => (
                <BentoGridItem
                  key={i}
                  title={feature.title}
                  description={feature.description}
                  header={feature.header}
                  icon={feature.icon}
                  className={feature.className}
                />
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Featured Skills */}
        <section className="border-t border-border py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold">Featured Skills</h2>
                <p className="mt-2 text-muted">
                  Top-rated, security-certified skills
                </p>
              </div>
              <LinkButton
                href="/skills"
                variant="ghost"
                endContent={<ArrowRight className="h-4 w-4" />}
              >
                View All
              </LinkButton>
            </div>

            <HoverEffect items={featuredSkills} />
          </div>
        </section>

        {/* Categories */}
        <section className="border-t border-border py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Browse by Category</h2>
              <p className="mt-2 text-muted">
                Find the perfect skill for your workflow
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/skills?category=${category.slug}`}
                    className="group flex flex-col items-center rounded-2xl border border-border bg-card p-4 transition-all hover:border-[var(--proven-green-500)]/50 hover:bg-card/80 hover:-translate-y-1"
                  >
                    <span className="text-4xl transition-transform group-hover:scale-110">
                      {category.icon}
                    </span>
                    <span className="mt-3 font-medium">{category.name}</span>
                    <span className="text-sm text-muted">{category.count}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <BackgroundGradient containerClassName="w-full" className="rounded-3xl">
              <div className="rounded-3xl bg-card/90 backdrop-blur-sm p-8 sm:p-12 lg:p-16">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-3xl font-bold sm:text-4xl">
                    Start Selling Your Skills
                  </h2>
                  <p className="mt-4 text-lg text-muted">
                    Join 500+ creators earning 80% of every sale. Security
                    certification included for free.
                  </p>
                  <LinkButton
                    href="/sell"
                    size="lg"
                    variant="primary"
                    className="mt-8 px-8 rounded-full"
                    endContent={<ArrowRight className="h-4 w-4" />}
                  >
                    Become a Creator
                  </LinkButton>
                </div>
              </div>
            </BackgroundGradient>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
