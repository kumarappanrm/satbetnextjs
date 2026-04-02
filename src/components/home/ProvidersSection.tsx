'use client';
import React from 'react';
import Link from 'next/link';
import type { ProviderCard } from './types';

export default function ProvidersSection({ providers, boxId = 'game_provider_slider_box' }: { providers: ProviderCard[]; boxId?: string }) {
  return (
    <div className="bt_common_align game_prvider_align" id={boxId}>
      <div className="container-fluid">
        <div className="section_header_div">
          <div className="title">Game Providers</div>
          <div className="swiper_btn_sec position-relative d-flex align-items-center">
            <div className="swiper-pagination-section">
              <div className="swiper-button-prev" tabIndex={0} role="button" aria-label="Previous slide">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhAQMAAABtKlAsAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBgOAAAAxgAB/v0USgAAAABJRU5ErkJggg=="
                  alt="slide-arrow"
                  className="swiper-left-arrow slide_arrow"
                  width={33}
                  height={33}
                />
              </div>
              <div className="swiper-button-next" tabIndex={0} role="button" aria-label="Next slide">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhAQMAAABtKlAsAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBgOAAAAxgAB/v0USgAAAABJRU5ErkJggg=="
                  alt="slide-arrow"
                  className="swiper-right-arrow slide_arrow"
                  width={33}
                  height={33}
                />
              </div>
            </div>
            <Link href="/casino-games" className="see_more_btn">
              See All
            </Link>
          </div>
        </div>

        <div className="swiper swiper-container double_layer">
          <div className="swiper-wrapper" id="game_provider_slider">
            {providers.map((provider) => (
              <div className="swiper-slide providers_slider" key={provider.name}>
                <Link href={provider.link}>
                  <img
                    src={provider.img}
                    className={provider.className}
                    loading="lazy"
                    alt="icon"
                    width={141}
                    height={94}
                  />
                  <p className="provider_name">{provider.name}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
