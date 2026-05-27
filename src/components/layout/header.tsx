"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Shield, Search, Menu, X, LogOut, User, Settings, Loader2, Package } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { LinkButton } from "@/components/ui";
import { useUser } from "@/hooks";
import { createBrowserClient } from "@/lib/supabase";
import { globalSearch, type SearchResult } from "@/lib/actions";

const navItems = [
  { href: "/skills", label: "Skills" },
  { href: "/mcp-servers", label: "MCP Servers" },
  { href: "/creators", label: "Creators" },
  { href: "/docs", label: "Docs" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading } = useUser();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const results = await globalSearch(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 300);
  };

  const handleResultClick = (result: SearchResult) => {
    setShowSearchResults(false);
    setSearchQuery("");
    if (result.type === "skill") {
      router.push(`/skills/${result.slug}`);
    } else {
      router.push(`/creators/${result.slug}`);
    }
  };

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--proven-green-500)] to-[var(--proven-green-700)]">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">
            Proven<span className="text-[var(--proven-green-500)]">Skills</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[var(--proven-green-500)]",
                pathname === item.href
                  ? "text-[var(--proven-green-500)]"
                  : "text-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted z-10" />
            <input
              type="search"
              placeholder="Search skills & creators..."
              value={searchQuery}
              onChange={onSearchChange}
              onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
              className="h-9 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted focus:border-[var(--proven-green-500)] focus:outline-none focus:ring-1 focus:ring-[var(--proven-green-500)]"
            />

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-border bg-card shadow-lg overflow-hidden z-50">
                {isSearching ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-background transition-colors"
                      >
                        {result.type === "skill" ? (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--proven-green-500)]/10 text-lg">
                            {result.image || "📦"}
                          </div>
                        ) : result.image ? (
                          <img
                            src={result.image}
                            alt={result.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--proven-green-500)]">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{result.name}</p>
                          <p className="text-xs text-muted truncate">{result.extra}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-sm text-muted">
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
          <LinkButton href="/sell" variant="ghost" size="sm">
            Sell Skills
          </LinkButton>

          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-card" />
          ) : user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--proven-green-500)] focus:ring-offset-2 focus:ring-offset-background"
              >
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--proven-green-500)]">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg">
                  <div className="border-b border-border px-4 py-3">
                    <p className="font-medium">{profile?.full_name || "User"}</p>
                    <p className="text-sm text-muted truncate">
                      @{profile?.username || user.email?.split("@")[0]}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:bg-card hover:text-foreground"
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:bg-card hover:text-foreground"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-border py-1">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--error)] hover:bg-[var(--error)]/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <LinkButton href="/login" size="sm" variant="primary">
              Sign In
            </LinkButton>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden rounded-lg p-2 text-muted hover:bg-card hover:text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="space-y-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-base font-medium transition-colors",
                  pathname === item.href
                    ? "bg-[var(--proven-green-500)]/10 text-[var(--proven-green-500)]"
                    : "text-muted hover:bg-card hover:text-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/sell"
              className="block rounded-lg px-3 py-2 text-base font-medium text-muted hover:bg-card hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Sell Skills
            </Link>
            <div className="pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--proven-green-500)]">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{profile?.full_name || "User"}</p>
                      <p className="text-sm text-muted">
                        @{profile?.username || user.email?.split("@")[0]}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-[var(--error)] hover:bg-[var(--error)]/10"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign out
                  </button>
                </div>
              ) : (
                <LinkButton
                  href="/login"
                  variant="primary"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </LinkButton>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
