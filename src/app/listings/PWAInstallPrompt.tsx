'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/app/hooks/usePWAInstall';
import { useIsMobile } from '@/hooks/use-mobile';

export function PWAInstallPrompt() {
  const { toast } = useToast();
  const { isInstallable, install } = usePWAInstall();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile && isInstallable) {
      toast({
        title: 'Install Affyto App',
        description:
          'Install our app for a better experience and instant notifications',
        action: (
          <Button variant="default" onClick={install}>
            Install
          </Button>
        ),
        duration: 10000,
      });
    }
  }, [isMobile, isInstallable, toast, install]);

  return null;
}
