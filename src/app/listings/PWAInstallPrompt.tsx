'use client';

import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/app/hooks/usePWAInstall';
import { useIsMobile } from '@/hooks/use-mobile';

export function PWAInstallPrompt() {
  const { toast } = useToast();
  const { isInstallable, install } = usePWAInstall();
  const isMobile = useIsMobile();
  const [hasShownToast, setHasShownToast] = useState(false);

  const showInstallPrompt = useCallback(() => {
    if (!hasShownToast && isMobile && isInstallable) {
      toast({
        title: 'Install Affyto App',
        description: (
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="Affyto" className="h-5 w-5" />
            Install our app for a better experience and instant notifications
          </div>
        ),
        action: (
          <Button variant="default" onClick={install}>
            Install
          </Button>
        ),
        duration: 1000000000,
      });
      setHasShownToast(true);
    }
  }, [hasShownToast, isMobile, isInstallable, toast, install]);

  useEffect(() => {
    showInstallPrompt();
  }, [showInstallPrompt]);

  return null;
}
