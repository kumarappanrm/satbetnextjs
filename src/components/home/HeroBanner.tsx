'use client';
import React from 'react';
import type { HeroSlide } from './types';

export default function HeroBanner({ slides }: { slides: HeroSlide[] }) {
  return (
    <div className="bt_common_align">
      <div className="swiper mySwiper herosec_swipper">
        <div className="swiper-wrapper herosec_swipper_wrapper">
          {slides.map((s, idx) => (
            <div className="swiper-slide" key={s.src}>
              <a href={s.href}>
                <img
                  className="banner-side"
                  src={s.src}
                  alt={s.alt}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  fetchPriority={idx === 0 ? 'high' : 'low'}
                />
              </a>
            </div>
          ))}
        </div>
        <div className="swiper-pagination herosec_pagination"></div>
      </div>
    </div>
  );
}

