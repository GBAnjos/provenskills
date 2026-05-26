import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ProvenSkills - The Secure AI Skills Marketplace",
    template: "%s | ProvenSkills",
  },
  description:
    "The only marketplace for AI agent skills with enterprise-grade security certification. Every skill is verified before you install.",
  keywords: [
    "AI skills",
    "MCP servers",
    "Claude Code",
    "agent skills",
    "marketplace",
    "security",
    "certified",
  ],
  authors: [{ name: "ProvenSkills" }],
  creator: "ProvenSkills",
  metadataBase: new URL("https://provenskills.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://provenskills.dev",
    title: "ProvenSkills - The Secure AI Skills Marketplace",
    description:
      "The only marketplace for AI agent skills with enterprise-grade security certification.",
    siteName: "ProvenSkills",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProvenSkills - The Secure AI Skills Marketplace",
    description:
      "The only marketplace for AI agent skills with enterprise-grade security certification.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
