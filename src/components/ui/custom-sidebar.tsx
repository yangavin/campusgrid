'use client';

import React, { useState, useEffect } from 'react';
import { ViewVerticalIcon } from '@radix-ui/react-icons';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { SquareMenuIcon, MapPinnedIcon } from 'lucide-react';

interface CustomSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function CustomSidebar({ children, className }: CustomSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render until we know the mobile state
  if (isMobile === undefined) {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <Button
          variant="outline"
          className="fixed bottom-14 left-4 z-50 h-16 w-16 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <MapPinnedIcon size={24} /> : <SquareMenuIcon size={24} />}
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-transform duration-300 ease-in-out',
          isMobile ? 'w-full' : 'w-1/3',
          isMobile && !isOpen && '-translate-x-full',
          className
        )}
      >
        {/* Sidebar Content */}
        <div className="h-full overflow-y-auto p-4">{children}</div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
