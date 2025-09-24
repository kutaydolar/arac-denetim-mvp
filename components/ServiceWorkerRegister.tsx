'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Check if we're in StackBlitz environment or if service workers are not supported
    const isStackBlitz = typeof window !== 'undefined' && 
      (window.location.hostname.includes('stackblitz') || 
       window.location.hostname.includes('webcontainer') ||
       !('serviceWorker' in navigator));

    // Only register service worker if supported and not in StackBlitz
    if (typeof window !== 'undefined' && !isStackBlitz) {
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