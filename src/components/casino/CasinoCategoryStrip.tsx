'use client';

import React from 'react';
import Link from 'next/link';
import type { CasinoCategoryRecord } from '@/types/casino-games';

const CASINO_LOBBY_PATH = '/casino-games';
const HUB_SLUG = 'casino-games';

const DUMMY_CATEGORY_ICON =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

type Props = {
  categories: CasinoCategoryRecord[];
  activeCategorySlug: string;
  /** Base path for the lobby (no `?category=`). Default: `/casino-games`. */
  lobbyPath?: string;
  /** Category slug/id that maps to the plain lobby URL (no query). Default: `casino-games`. */
  hubSlug?: string;
};

/** Same structure as SATBET `casinogame_menu` (e.g. live / casino HTML dumps). */
export default function CasinoCategoryStrip({
  categories,
  activeCategorySlug,
  lobbyPath = CASINO_LOBBY_PATH,
  hubSlug = HUB_SLUG,
}: Props) {
  return (
    <div className="casinogame_menu">
      <ul>
        {categories.map((c) => {
          const slug = c.slug;
          const isHub = slug === hubSlug || c.id === hubSlug;
          const href = isHub
            ? lobbyPath
            : `${lobbyPath}?category=${encodeURIComponent(slug)}`;
          const isActive =
            activeCategorySlug === ''
              ? isHub
              : activeCategorySlug === slug || activeCategorySlug === c.id;

          const liClass = isActive
            ? ' active providerFilter casino-menu_icon_section1'
            : '  providerFilter casino-menu_icon_section1';

          const tileStyle: React.CSSProperties | undefined = c.gradient
            ? {
                background: `linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 45%), ${c.gradient}`,
              }
            : undefined;

          return (
            <li key={c.id} data-cat={slug} className={liClass}>
              <Link href={href} scroll={false} prefetch={false}>
                <div className="casino_menu_icon1" style={tileStyle}>
                  <img
                    src={c.iconSrc || DUMMY_CATEGORY_ICON}
                    alt=""
                    className="menu_align"
                    loading="lazy"
                    width={136}
                    height={100}
                  />
                  <p>{c.label}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
