export interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number;
  isFree: boolean;
  category: Category;
  categoryId: string;
  creator: Creator;
  creatorId: string;
  installCommand: string;
  githubUrl?: string;
  version: string;
  downloads: number;
  rating: number;
  reviewCount: number;
  securityScore: SecurityScore;
  badges: Badge[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Creator {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  githubUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  isVerified: boolean;
  totalSales: number;
  totalEarnings: number;
  skills: Skill[];
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  skillCount: number;
}

export interface SecurityScore {
  overall: "A" | "B" | "C" | "D" | "F";
  score: number;
  checks: SecurityCheck[];
  scannedAt: Date;
}

export interface SecurityCheck {
  name: string;
  passed: boolean;
  severity: "critical" | "high" | "medium" | "low" | "info";
  description: string;
}

export type Badge =
  | "security-certified"
  | "verified-creator"
  | "top-rated"
  | "enterprise-ready"
  | "trending"
  | "new";

export interface Review {
  id: string;
  skillId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface MCPServer {
  id: string;
  name: string;
  slug: string;
  description: string;
  tools: string[];
  resources: string[];
  installCommand: string;
  githubUrl?: string;
  downloads: number;
  createdAt: Date;
}
