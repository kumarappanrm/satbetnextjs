// App-wide constants (replace with env variables in production)
export const APP_CONFIG = {
  USERNAME_MINLENGTH: 4,
  USERNAME_MAXLENGTH: 20,
  USERPASSWORD_MINLENGTH: 6,
  USERPASSWORD_MAXLENGTH: 15,
  DEMO_USERNAME: process.env.NEXT_PUBLIC_DEMO_USERNAME || 'demo',
  DEMO_USER_PASSWORD: process.env.NEXT_PUBLIC_DEMO_PASSWORD || 'demo@123',
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/',
  /** Prefer `FEATURES.gtmId` / `NEXT_PUBLIC_GTM_ID` for new code */
  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-TM9BSSML',
};

// Centralized config (used by storage/auth helpers)
export const config = {
  auth: {
    tokenKey: process.env.NEXT_PUBLIC_TOKEN_KEY || 'auth_token',
  },
};

/** Path-only hrefs so `next/link` can client-navigate without a full document reload */
export const NAV_ITEMS = [
  { label: 'Exchange', href: '/exchange', icon: '/assets/80F5992-exchange.gif', className: 'exchange-gif' },
  { label: 'Sports', href: '/sportsbook', icon: '/assets/2A7CB27C-sports.gif', className: '' },
  { label: 'Casino', href: '/casino-games', icon: '/assets/1DAC6084-casino.gif', className: '' },
  { label: 'Live Casino', href: '/live-casino-games', icon: '/assets/933D880D-live.gif', className: '' },
  {
    label: 'Promotions',
    href: '/promotions',
    icon: '/assets/26D9D4D2-promo.gif',
    className: '',
    iconStyle: { borderRadius: 'var(--sb_px15)', border: '2px solid' },
  },
];

export const TIER_LABELS: Record<number, string> = {
  1: 'Silver',
  2: 'Gold',
  3: 'Platinum',
  4: 'VIP',
};

export const TIER_IMAGES: Record<number, string> = {
  1: '/images/level-silver.svg',
  2: '/images/level-gold.svg',
  3: '/images/level-platinum.svg',
  4: '/images/level-vip.svg',
};
