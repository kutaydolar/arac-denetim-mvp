'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // More comprehensive check for StackBlitz and unsupported environments
    const isStackBlitz = typeof window !== 'undefined' && 
      (window.location.hostname.includes('stackblitz') || 
       window.location.hostname.includes('webcontainer') ||
       window.location.hostname.includes('bolt.new') ||
       window.location.hostname.includes('credentialless-staticblitz') ||
       window.location.hostname.includes('w-credentialless') ||
       !('serviceWorker' in navigator));

    // Early return if in unsupported environment - don't even import Serwist
    if (isStackBlitz) {
      return;
    }

    // Only register service worker if supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      import('@serwist/window').then(async ({ Serwist }) => {
        const serwist = new Serwist('/sw.js', { scope: '/' });
        await serwist.register();
      }).catch(() => {
        // Silently fail if service worker registration fails
      });
    }
  }, []);

  return null;
}