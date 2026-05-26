export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          website_url: string | null;
          github_url: string | null;
          twitter_url: string | null;
          is_creator: boolean;
          is_verified: boolean;
          stripe_account_id: string | null;
          stripe_onboarding_complete: boolean;
          total_sales: number;
          total_earnings: number;
          skills_count: number;
          average_rating: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website_url?: string | null;
          github_url?: string | null;
          twitter_url?: string | null;
          is_creator?: boolean;
          is_verified?: boolean;
          stripe_account_id?: string | null;
          stripe_onboarding_complete?: boolean;
          total_sales?: number;
          total_earnings?: number;
          skills_count?: number;
          average_rating?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website_url?: string | null;
          github_url?: string | null;
          twitter_url?: string | null;
          is_creator?: boolean;
          is_verified?: boolean;
          stripe_account_id?: string | null;
          stripe_onboarding_complete?: boolean;
          total_sales?: number;
          total_earnings?: number;
          skills_count?: number;
          average_rating?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          skill_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          skill_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          skill_count?: number;
          created_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          long_description: string | null;
          price: number;
          is_free: boolean;
          category_id: string;
          creator_id: string;
          install_command: string;
          github_url: string | null;
          version: string;
          downloads: number;
          rating: number;
          review_count: number;
          security_score: string;
          security_grade: string;
          badges: string[];
          tags: string[];
          is_published: boolean;
          is_featured: boolean;
          scanned_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          long_description?: string | null;
          price?: number;
          is_free?: boolean;
          category_id: string;
          creator_id: string;
          install_command: string;
          github_url?: string | null;
          version?: string;
          downloads?: number;
          rating?: number;
          review_count?: number;
          security_score?: string;
          security_grade?: string;
          badges?: string[];
          tags?: string[];
          is_published?: boolean;
          is_featured?: boolean;
          scanned_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          long_description?: string | null;
          price?: number;
          is_free?: boolean;
          category_id?: string;
          creator_id?: string;
          install_command?: string;
          github_url?: string | null;
          version?: string;
          downloads?: number;
          rating?: number;
          review_count?: number;
          security_score?: string;
          security_grade?: string;
          badges?: string[];
          tags?: string[];
          is_published?: boolean;
          is_featured?: boolean;
          scanned_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      security_scans: {
        Row: {
          id: string;
          skill_id: string;
          overall_score: number;
          grade: string;
          checks: Json;
          scanned_at: string;
        };
        Insert: {
          id?: string;
          skill_id: string;
          overall_score: number;
          grade: string;
          checks: Json;
          scanned_at?: string;
        };
        Update: {
          id?: string;
          skill_id?: string;
          overall_score?: number;
          grade?: string;
          checks?: Json;
          scanned_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          skill_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          skill_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          skill_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          skill_id: string;
          user_id: string;
          price_paid: number;
          stripe_payment_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          skill_id: string;
          user_id: string;
          price_paid: number;
          stripe_payment_id?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          skill_id?: string;
          user_id?: string;
          price_paid?: number;
          stripe_payment_id?: string | null;
          status?: string;
          created_at?: string;
        };
      };
      mcp_servers: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          tools: string[];
          resources: string[];
          install_command: string;
          github_url: string | null;
          creator_id: string;
          downloads: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          tools?: string[];
          resources?: string[];
          install_command: string;
          github_url?: string | null;
          creator_id: string;
          downloads?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          tools?: string[];
          resources?: string[];
          install_command?: string;
          github_url?: string | null;
          creator_id?: string;
          downloads?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
