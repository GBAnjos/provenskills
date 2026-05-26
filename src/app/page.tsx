import Link from "next/link";
import { Card, CardContent } from "@heroui/react";
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
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Badge, LinkButton } from "@/components/ui";

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
    name: "SEO Audit Pro",
    creator: "seomaster",
    price: 14.99,
    rating: 4.9,
    downloads: 2340,
    badge: "security-certified" as const,
  },
  {
    name: "API Documentation",
    creator: "docgen",
    price: 0,
    rating: 4.7,
    downloads: 5621,
    badge: "security-certified" as const,
  },
  {
    name: "Test Generator",
    creator: "testcraft",
    price: 19.99,
    rating: 5.0,
    downloads: 1892,
    badge: "top-rated" as const,
  },
  {
    name: "Code Review AI",
    creator: "reviewbot",
    price: 24.99,
    rating: 4.8,
    downloads: 3104,
    badge: "enterprise-ready" as const,
  },
];

const categories = [
  { name: "Frontend", count: 89, icon: "🎨" },
  { name: "Backend", count: 124, icon: "⚙️" },
  { name: "DevOps", count: 67, icon: "🚀" },
  { name: "Testing", count: 93, icon: "🧪" },
  { name: "AI/ML", count: 45, icon: "🤖" },
  { name: "Data", count: 78, icon: "📊" },
  { name: "Security", count: 34, icon: "🔒" },
  { name: "Docs", count: 56, icon: "📝" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--proven-green-500)]/5 via-transparent to-[var(--proven-blue-500)]/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--proven-green-500)]/10 via-transparent to-transparent" />

          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="text-center">
              <Badge
                variant="success"
                icon={<Shield className="h-3 w-3" />}
                className="mb-6"
              >
                Every skill is security-certified
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                The{" "}
                <span className="bg-gradient-to-r from-[var(--proven-green-400)] to-[var(--proven-green-600)] bg-clip-text text-transparent">
                  Secure
                </span>{" "}
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
                <LinkButton
                  href="/skills"
                  size="lg"
                  variant="primary"
                  className="px-8"
                  endContent={<ArrowRight className="h-4 w-4" />}
                >
                  Browse Skills
                </LinkButton>
                <LinkButton
                  href="/sell"
                  size="lg"
                  variant="outline"
                  className="px-8"
                >
                  Start Selling
                </LinkButton>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm"
                  >
                    <stat.icon className="mx-auto h-6 w-6 text-[var(--proven-green-500)]" />
                    <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Security Matters */}
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
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

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {/* Security Checks List */}
              <Card className="bg-card border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--proven-green-500)]/10">
                      <ShieldCheck className="h-5 w-5 text-[var(--proven-green-500)]" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      12-Point Security Certification
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {securityChecks.map((check, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-[var(--proven-green-500)]" />
                        <span className="text-sm">{check}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="space-y-4">
                <Card className="bg-card border border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--proven-green-500)]/10">
                        <Eye className="h-6 w-6 text-[var(--proven-green-500)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Transparent Scanning
                        </h3>
                        <p className="mt-1 text-muted">
                          Every skill shows its full security report. No hidden
                          issues, no surprises.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--proven-blue-500)]/10">
                        <Users className="h-6 w-6 text-[var(--proven-blue-500)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Verified Creators
                        </h3>
                        <p className="mt-1 text-muted">
                          All creators pass identity verification. Know who
                          built your tools.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--proven-green-500)]/10">
                        <Terminal className="h-6 w-6 text-[var(--proven-green-500)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Sandbox Testing
                        </h3>
                        <p className="mt-1 text-muted">
                          Skills run in isolated environments before approval.
                          Behavior is monitored.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Skills */}
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
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

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredSkills.map((skill) => (
                <Card
                  key={skill.name}
                  className="bg-card border border-border hover:border-[var(--proven-green-500)]/50 transition-colors"
                                  >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <Badge
                        size="sm"
                        variant="success"
                        icon={<ShieldCheck className="h-3 w-3" />}
                      >
                        Certified
                      </Badge>
                      {skill.price === 0 ? (
                        <span className="text-sm font-medium text-[var(--proven-green-500)]">
                          FREE
                        </span>
                      ) : (
                        <span className="text-sm font-medium">
                          ${skill.price}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 font-semibold text-lg">{skill.name}</h3>
                    <p className="text-sm text-muted">by @{skill.creator}</p>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span>{skill.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted">
                        <Download className="h-4 w-4" />
                        <span>{skill.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Browse by Category</h2>
              <p className="mt-2 text-muted">
                Find the perfect skill for your workflow
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/skills?category=${category.name.toLowerCase()}`}
                  className="group flex flex-col items-center rounded-xl border border-border bg-card p-4 transition-all hover:border-[var(--proven-green-500)]/50 hover:bg-card/80"
                >
                  <span className="text-3xl">{category.icon}</span>
                  <span className="mt-2 font-medium">{category.name}</span>
                  <span className="text-sm text-muted">{category.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-br from-[var(--proven-green-500)] to-[var(--proven-green-700)] p-8 sm:p-12 lg:p-16">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Start Selling Your Skills
                </h2>
                <p className="mt-4 text-lg text-white/80">
                  Join 500+ creators earning 80% of every sale. Security
                  certification included for free.
                </p>
                <LinkButton
                  href="/sell"
                  size="lg"
                  className="mt-8 bg-white text-[var(--proven-green-700)] hover:bg-white/90 px-8"
                  endContent={<ArrowRight className="h-4 w-4" />}
                >
                  Become a Creator
                </LinkButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
