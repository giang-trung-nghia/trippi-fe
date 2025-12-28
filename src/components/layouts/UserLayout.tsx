"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlignJustify, Map, Compass, Plane } from "lucide-react";
import { useUserPreferencesStore } from "@/store/use-user-preferences-store";
import { useUserStore } from "@/store/use-user-store";
import { UserMenu } from "@/features/auth/components/user-menu";
import { CreateTripDialog } from "@/features/trip/components/trips/create-trip-dialog";
import { RecentTripsList } from "@/features/trip/components/trips/recent-trips-list";

type UserLayoutProps = {
  children: ReactNode;
  className?: string;
};

export default function UserLayout({ children, className }: UserLayoutProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUserPreferencesStore();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isLoading = useUserStore((state) => state.isLoading);

  const sidebarItems = [
    { label: "Trips", icon: Plane, href: "/trips" },
    { label: "Explore", icon: Compass, href: "/explore" },
    { label: "Maps", icon: Map, href: "/maps" },
  ];

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-gray-50">
      {/* Sidebar with integrated header functionality */}
      <aside
        className={cn(
          "bg-white border-r transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo and Toggle */}
        <div className="p-4 flex justify-between items-center border-b shrink-0">
          <span className={sidebarCollapsed ? "hidden" : "font-bold text-lg"}>
            Trippi
          </span>
          <Button size="sm" variant="ghost" onClick={toggleSidebar}>
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Sidebar Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Create Trip Button */}
          <div className="px-4 pt-4 shrink-0">
            <CreateTripDialog collapsed={sidebarCollapsed} />
          </div>

          <Separator className="my-4" />

          {/* Navigation Items */}
          <div className="px-4 shrink-0">
            <div className={cn("flex flex-col gap-1", !sidebarCollapsed && "mb-4")}>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                
                return (
                  <TooltipProvider key={item.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className="justify-start w-full"
                          asChild
                        >
                          <Link href={item.href}>
                            <Icon className={cn("h-4 w-4", !sidebarCollapsed && "mr-2")} />
                            {!sidebarCollapsed && item.label}
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      {sidebarCollapsed && (
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>

          {/* Recent Trips - Only show when expanded */}
          {!sidebarCollapsed && (
            <>
              <Separator className="my-4" />
              <div className="flex-1 overflow-hidden px-4 min-h-0">
                <div className="mb-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Recent Trips
                  </h3>
                </div>
                <RecentTripsList collapsed={sidebarCollapsed} />
              </div>
            </>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Auth Section at Bottom */}
          <div className="border-t p-4 shrink-0">
            {isLoading ? (
              <div className={cn(
                "animate-pulse rounded-full bg-muted",
                sidebarCollapsed ? "h-10 w-10 mx-auto" : "h-10 w-full"
              )} />
            ) : isAuthenticated ? (
              <UserMenu />
            ) : (
              !sidebarCollapsed && (
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/sign-in?mode=signup">Sign up</Link>
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </aside>

      {/* Main Content - Full height without header */}
      <main
        className={cn(
          "flex-1 min-h-0 px-4",
          className === "p-0" ? "overflow-hidden" : "overflow-y-auto",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}
