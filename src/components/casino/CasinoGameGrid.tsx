'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CasinoGameRecord } from '@/types/casino-games';

/**
 * Casino lobby game grid (thumbnails + titles). Data comes from the parent, which filters JSON by
 * category, provider, and search — this component only handles layout and lazy-loaded batches.
 */

/** Multiple of 7 for row alignment with legacy grid */
const BATCH = 28;

type Props = {
  title?: string;
  games: CasinoGameRecord[];
  onPlayClick: (game: CasinoGameRecord) => void;
  /** When false, hide the guest LOGIN strip on thumbnails (e.g. logged-in users). */
  showGuestLoginCue?: boolean;
};

export default function CasinoGameGrid({
  title = 'Casino Games',
  games,
  onPlayClick,
  showGuestLoginCue = true,
}: Props) {
  const [visible, setVisible] = useState(Math.min(BATCH, games.length));
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisible(Math.min(BATCH, games.length));
  }, [games]);

  const slice = useMemo(() => games.slice(0, visible), [games, visible]);

  const loadMore = useCallback(() => {
    setVisible((v) => Math.min(v + BATCH, games.length));
  }, [games.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visible >= games.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          loadMore();
        }
      },
      { rootMargin: '400px 0px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [games.length, loadMore, visible]);

  return (
    <>
      <div className="container-fluid">
        <div className="section-header g-header">
          <div className="games-title">{title}</div>
          <div className="no_of_games">
            <p className="counts">{games.length} Games </p>
          </div>
          <span className="hidden-d">
            <div className="hidden-d spacer" />
          </span>
        </div>
      </div>

      <section className="download-area-bottom" aria-label="Game list">
        <div className="container-fluid">
          <div className="grid-container">
            {slice.map((game) => (
              <div key={game.id} className="single-download-box">
                <div
                  className="game-box st_featured_thumb"
                  data-game-id={game.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onPlayClick(game)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onPlayClick(game);
                    }
                  }}
                >
                  <figure
                    className={
                      game.providerLogoUrl
                        ? 'casino-tile-figure casino-tile-figure--with-provider'
                        : 'casino-tile-figure'
                    }
                  >
                    <img
                      src={game.thumbnailUrl}
                      alt=""
                      className="img-fluid lozad casino-game-thumb"
                      loading="lazy"
                      decoding="async"
                      width={300}
                      height={225}
                    />
                    {game.providerLogoUrl ? (
                      <img
                        src={game.providerLogoUrl}
                        className="casino-provider-badge"
                        alt=""
                        loading="lazy"
                      />
                    ) : null}
                    {showGuestLoginCue ? (
                      <div className="login-overlay" aria-hidden="true">
                        Login
                      </div>
                    ) : null}
                  </figure>
                </div>
                <div className="game-name boxed-btn" data-provider={game.provider}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPlayClick(game);
                    }}
                  >
                    {game.name}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {visible < games.length ? <div ref={sentinelRef} className="casino-grid-sentinel" aria-hidden /> : null}

          {games.length === 0 ? (
            <p className="casino-games-empty">No games match your filters.</p>
          ) : null}
        </div>
      </section>
    </>
  );
}
