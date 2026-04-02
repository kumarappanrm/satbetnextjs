'use client';
import React from 'react';
import Link from 'next/link';
import type { GameCard } from './types';

type Props = {
  boxId: string;
  title: string;
  sliderId: string;
  seeAllHref?: string;
  games: GameCard[];
};

export default function GamesSliderSection({ boxId, title, sliderId, seeAllHref = '/casino-games', games }: Props) {
  return (
    <div className="bt_common_align" id={boxId}>
      <div className="container-fluid">
        <div className="section_header_div">
          <div className="title">{title}</div>
          <div className="swiper_btn_sec position-relative d-flex align-items-center ">
            <div className="swiper-pagination-section">
              <div className="swiper-button-prev" tabIndex={0} role="button" aria-label="Previous slide">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhAQMAAABtKlAsAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBgOAAAAxgAB/v0USgAAAABJRU5ErkJggg=="
                  alt="slide-arrow"
                  className="swiper-left-arrow "
                  width={33}
                  height={33}
                />
              </div>
              <div className="swiper-button-next" tabIndex={0} role="button" aria-label="Next slide">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhAQMAAABtKlAsAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBgOAAAAxgAB/v0USgAAAABJRU5ErkJggg=="
                  alt="slide-arrow"
                  className="swiper-right-arrow"
                  width={33}
                  height={33}
                />
              </div>
            </div>
            <Link href={seeAllHref} className="see_more_btn">
              See All
            </Link>
          </div>
        </div>

        <div className="swiper swiper-container double_layer">
          <div className="swiper-wrapper" id={sliderId}>
            {games.map((game) => (
              <div className="swiper-slide" key={game.id}>
                <div className="game_overlay_main" data-game-id={game.id}>
                  <img
                    src={game.img}
                    className={`${game.className} newgame-img`}
                    loading="lazy"
                    alt={game.name}
                    width={300}
                    height={225}
                  />
                  <div className="overlay1">
                    <div className="text play_btn" id="Login_play">
                      <img className="play_icon" src="/assets/E4C1E700-login_icon.svg" alt="play-icon" />
                    </div>
                    <div className="game-name">{game.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

