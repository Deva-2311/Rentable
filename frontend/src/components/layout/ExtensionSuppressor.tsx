'use client';

import { useEffect } from 'react';

export function ExtensionSuppressor() {
  useEffect(() => {
    const purgeWidgets = () => {
      const selectors = [
        '.hk-banner-only',
        '.hk-ad-banner',
        '.hk-banner-close-btn',
        '.hk-recoBox',
        '.hk-recom-main-div',
        '[class*="hk-banner"]',
        '[class*="hk-ad"]',
        '[id*="hatke"]',
        '[id*="buyhatke"]',
      ];
      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          el.remove();
        });
      });
    };

    purgeWidgets();

    const observer = new MutationObserver(() => {
      purgeWidgets();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
