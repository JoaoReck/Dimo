import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export interface MobilePWAState {
  isMobile: boolean;
  isIOS: boolean;
  isSafari: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
  canInstallNative: boolean;
  hasDismissedBanner: boolean;
  isGuideOpen: boolean;
  openGuide: () => void;
  closeGuide: () => void;
  dismissBanner: () => void;
  triggerNativeInstall: () => Promise<boolean>;
  confirmGuideCompleted: () => void;
}

const STORAGE_DISMISSED_KEY = 'dimo_pwa_banner_dismissed_at';
const STORAGE_GUIDE_SEEN_KEY = 'dimo_pwa_guide_seen';

export function useMobilePWA(): MobilePWAState {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isSafari, setIsSafari] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hasDismissedBanner, setHasDismissedBanner] = useState<boolean>(true); // default true until verified
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  useEffect(() => {
    // 1. Standalone / Web App detection
    const checkStandalone = () => {
      const isDisplayStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isNavigatorStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const isAndroidReferrer = document.referrer.includes('android-app://');
      return Boolean(isDisplayStandalone || isNavigatorStandalone || isAndroidReferrer);
    };

    const standaloneActive = checkStandalone();
    setIsStandalone(standaloneActive);

    // 2. Mobile User Agent detection
    const ua = window.navigator.userAgent.toLowerCase();
    
    // Check iOS: iPhone, iPad, iPod (including iPadOS desktop spoofing)
    const isIOSDevice =
      /iphone|ipad|ipod/.test(ua) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

    // Check Safari on iOS (WebKit without Chrome/Firefox/CriOS wrapper)
    const isIOSSafari =
      isIOSDevice &&
      /safari/.test(ua) &&
      !/crios|fxios|optios|edgios|opios/.test(ua);

    // Check Android
    const isAndroidDevice = /android/.test(ua);

    // Check general mobile screen / touch
    const hasTouch = 'ontouchstart' in window || window.navigator.maxTouchPoints > 0;
    const isMobileWidth = window.innerWidth <= 840;
    const isMobileDevice = (isIOSDevice || isAndroidDevice || (hasTouch && isMobileWidth));

    setIsMobile(isMobileDevice);
    setIsIOS(isIOSDevice);
    setIsSafari(isIOSSafari);
    setIsAndroid(isAndroidDevice);

    // 3. Dismissed / Guide seen state
    if (standaloneActive) {
      setHasDismissedBanner(true);
    } else {
      const dismissedAt = localStorage.getItem(STORAGE_DISMISSED_KEY);
      const guideSeen = localStorage.getItem(STORAGE_GUIDE_SEEN_KEY);

      if (guideSeen === 'true') {
        // If user already completed the tutorial, don't show the intrusive banner,
        // but keep the discrete header CTA available.
        setHasDismissedBanner(true);
      } else if (dismissedAt) {
        const timeDiff = Date.now() - parseInt(dismissedAt, 10);
        // Suppress banner for 24 hours if dismissed
        if (timeDiff < 24 * 60 * 60 * 1000) {
          setHasDismissedBanner(true);
        } else {
          setHasDismissedBanner(false);
        }
      } else {
        setHasDismissedBanner(false);
      }
    }

    // 4. Android / Chromium native install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      setHasDismissedBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen to display-mode changes (e.g. if opened in split window or launched)
    const mediaMatcher = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsStandalone(true);
        setHasDismissedBanner(true);
      }
    };
    mediaMatcher.addEventListener?.('change', handleMediaChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaMatcher.removeEventListener?.('change', handleMediaChange);
    };
  }, []);

  const openGuide = useCallback(() => {
    setIsGuideOpen(true);
  }, []);

  const closeGuide = useCallback(() => {
    setIsGuideOpen(false);
  }, []);

  const dismissBanner = useCallback(() => {
    setHasDismissedBanner(true);
    try {
      localStorage.setItem(STORAGE_DISMISSED_KEY, Date.now().toString());
    } catch (err) {
      console.warn('Could not save dismissal state:', err);
    }
  }, []);

  const confirmGuideCompleted = useCallback(() => {
    setIsGuideOpen(false);
    setHasDismissedBanner(true);
    try {
      localStorage.setItem(STORAGE_GUIDE_SEEN_KEY, 'true');
    } catch (err) {
      console.warn('Could not save guide seen state:', err);
    }
  }, []);

  const triggerNativeInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      // Fallback to guide
      openGuide();
      return false;
    }
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setHasDismissedBanner(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error triggering native prompt:', err);
      openGuide();
      return false;
    }
  }, [deferredPrompt, openGuide]);

  return {
    isMobile,
    isIOS,
    isSafari,
    isAndroid,
    isStandalone,
    canInstallNative: Boolean(deferredPrompt),
    hasDismissedBanner,
    isGuideOpen,
    openGuide,
    closeGuide,
    dismissBanner,
    triggerNativeInstall,
    confirmGuideCompleted,
  };
}
