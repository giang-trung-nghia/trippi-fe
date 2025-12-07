"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/features/auth/components/user-menu";
import { useUserStore } from "@/store/use-user-store";

/**
 * Header Component (Organism)
 * Main navigation header with authentication state
 * - Shows Sign In/Sign Up buttons when not authenticated
 * - Shows user menu with avatar when authenticated
 */
export function Header() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isLoading = useUserStore((state) => state.isLoading);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="relative flex h-16 items-center">
        {/* Left spacer - takes up space but empty */}
        <div className="flex-1"></div>

        {/* Navigation - Always centered */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
          <Link
            href="/trips"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Trips
          </Link>
          <Link
            href="/explore"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Explore
          </Link>
          <Link
            href="/maps"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Maps
          </Link>
        </nav>

        {/* Auth Section - Always at the end */}
        <div className="flex-1 flex items-center justify-end pr-4">
          {isLoading ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          ) : isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-in?mode=signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
