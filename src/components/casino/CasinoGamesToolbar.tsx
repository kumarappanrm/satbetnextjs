'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { CasinoProviderRecord } from '@/types/casino-games';

/** Same assets as `casino-games_files/casino-games.html` + all-minify search background URL */
const DROPDOWN_ARROW = 'https://satbet-proof.s3.amazonaws.com/dropdown_arrow.png';
const SEARCH_ICON_IMG = 'https://satbetqa.s3.amazonaws.com/search_icon.png';

type Props = {
  providers: CasinoProviderRecord[];
  selectedProviderSlug: string;
  onProviderChange: (slug: string) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  onSearchSubmit: () => void;
};

export default function CasinoGamesToolbar({
  providers,
  selectedProviderSlug,
  onProviderChange,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selectedLabel =
    providers.find((p) => p.slug === selectedProviderSlug)?.label ??
    providers[0]?.label ??
    'All Game Providers';

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current && !wrapRef.current.contains(t)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div className="game_provider_search_structure">
      <div className="search-container">
        <div className="casino_search_dropdown_wrap" ref={wrapRef}>
          <button type="button" className="dropbtn" onClick={() => setOpen((v) => !v)}>
            {selectedLabel}
            <img src={DROPDOWN_ARROW} alt="" />
          </button>
          <div className={`dropdown-content${open ? ' show' : ''}`} role="listbox" aria-hidden={!open}>
            {providers.map((p) => (
              <a
                key={p.slug || 'all'}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onProviderChange(p.slug);
                  setOpen(false);
                }}
              >
                {p.label}
              </a>
            ))}
          </div>
        </div>
        <input
          type="text"
          className="search-input casino_Search searchgame"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSearchSubmit();
            }
          }}
        />
        <button type="button" className="search-button " onClick={onSearchSubmit}>
          Search
        </button>
        <button type="button" className="search-icon" onClick={onSearchSubmit} aria-label="Search">
          <img src={SEARCH_ICON_IMG} alt="" />
        </button>
      </div>
    </div>
  );
}
