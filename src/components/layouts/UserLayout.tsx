"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlignJustify } from "lucide-react";
import { Header } from "@/components/organisms/header";
import { CreateTripDialog } from "@/features/trip/components/trips/create-trip-dialog";
import { RecentTripsList } from "@/features/trip/components/trips/recent-trips-list";
import { useUserPreferencesStore } from "@/store/use-user-preferences-store";

interface UserLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function UserLayout({ children, className }: UserLayoutProps) {
  const { sidebarCollapsed, toggleSidebar } = useUserPreferencesStore();

  const sidebarItems = [
    { label: "Dashboard", icon: "🏠" },
    { label: "Profile", icon: "👤" },
    { label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r transition-all duration-300",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <span className={sidebarCollapsed ? "hidden" : "font-bold text-lg"}>
            Trippi
          </span>
          <Button size="sm" variant="ghost" onClick={toggleSidebar}>
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col h-[calc(100vh-64px)]">
          <div className="px-4 pt-4">
            <CreateTripDialog collapsed={sidebarCollapsed} />
          </div>

          {!sidebarCollapsed && (
            <>
              <Separator className="my-4" />

              <div className="flex-1 overflow-hidden px-4">
                <div className="mb-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Recent Trips
                  </h3>
                </div>
                <RecentTripsList collapsed={sidebarCollapsed} />
              </div>
            </>
          )}
          <Separator className="my-4" />

          <ScrollArea className="px-4 pb-4">
            <div className="flex flex-col gap-1">
              {sidebarItems.map((item) => (
                <TooltipProvider key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="justify-start w-full">
                        <span className="mr-2">{item.icon}</span>
                        {!sidebarCollapsed && item.label}
                      </Button>
                    </TooltipTrigger>
                    {sidebarCollapsed && (
                      <TooltipContent>{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content */}
        <main
          className={cn(
            "flex-1 p-4 overflow-y-auto overflow-x-hidden",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
