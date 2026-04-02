/**
 * Public feature flags (all use NEXT_PUBLIC_* so they are baked in at build time).
 * Set any to "false" or "0" in `.env.local` to disable.
 */

function envBool(key: string, defaultValue = true): boolean {
  const v = process.env[key];
  if (v === undefined || v === '') return defaultValue;
  const lower = v.toLowerCase();
  return lower !== 'false' && lower !== '0' && lower !== 'no';
}

export const FEATURES = {
  /** Google Tag Manager (loads whatever tags you publish: Clarity, GA4, etc.) */
  gtm: envBool('NEXT_PUBLIC_ENABLE_GTM', true),
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-TM9BSSML',

  /** Search Console meta tag */
  googleSiteVerification: envBool('NEXT_PUBLIC_ENABLE_GOOGLE_SITE_VERIFICATION', true),
  googleSiteVerificationToken: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'VQspGpf_OaU9Kvai7Lt2lERm4zDz2UY-bQhF2AYw0xs',

  /** Can break pure-HTTP local previews; turn off if assets fail to load */
  cspUpgradeInsecure: envBool('NEXT_PUBLIC_ENABLE_CSP_UPGRADE_INSECURE', true),

  /** Allow search engines to index (use false on staging mirrors) */
  robotsIndex: envBool('NEXT_PUBLIC_ENABLE_ROBOTS_INDEX', true),

  /** Third-party exchange iframe (widgetjf.goldenspin.co) */
  embeddedExchangeIframe: envBool('NEXT_PUBLIC_ENABLE_EXCHANGE_IFRAME', true),

  /** prod.bollytech.com (and any https://) game thumbnails in sliders */
  remoteGameCdnImages: envBool('NEXT_PUBLIC_ENABLE_REMOTE_GAME_CDN_IMAGES', true),

  /** Bottom nav “bot” button calls window.Tawk_API when the Tawk script is present */
  tawkChatButton: envBool('NEXT_PUBLIC_ENABLE_TAWK_CHAT', true),
} as const;
