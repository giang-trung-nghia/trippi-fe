'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Header } from '@/components/organisms/header';
import { CreateTripDialog } from '@/features/trip/components/trips/create-trip-dialog';

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems = [
    { label: 'Dashboard', icon: '🏠' },
    { label: 'Profile', icon: '👤' },
    { label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'bg-white border-r transition-all duration-300',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <span className={collapsed ? 'hidden' : 'font-bold text-lg'}>Trippi</span>
          <Button size="sm" variant="ghost" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '>' : '<'}
          </Button>
        </div>

        <ScrollArea className="mt-4 h-[calc(100vh-64px)]">
          <div className="flex flex-col gap-4 px-4 pb-4">
            <CreateTripDialog collapsed={collapsed} />
            <div className="flex flex-col gap-1">
              {sidebarItems.map((item) => (
                <TooltipProvider key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                      >
                        <span className="mr-2">{item.icon}</span>
                        {!collapsed && item.label}
                      </Button>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent>{item.label}</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
