'use client';
import React, { useEffect, useRef } from 'react';

interface BannerSlide {
  target_url: string;
  desktop_image_url: string;
  mobile_image_url: string;
  alt?: string;
}

interface HeroBannerProps {
  slides: BannerSlide[];
}

// Static placeholder banners from original assets
const DEFAULT_SLIDES: BannerSlide[] = [
  { target_url: '#', desktop_image_url: '/images/SB_Cas_ICC_CT_2025_Web.webp', mobile_image_url: '/images/SB_Cas_ICC_CT_2025_Web.webp', alt: 'ICC CT 2025' },
  { target_url: '#', desktop_image_url: '/images/SB_Cas_Aviator_Web.webp', mobile_image_url: '/images/SB_Cas_Aviator_Web.webp', alt: 'Aviator' },
  { target_url: '#', desktop_image_url: '/images/SB_Cric_WIPL_2025_Web.webp', mobile_image_url: '/images/SB_Cric_WIPL_2025_Web.webp', alt: 'WIPL 2025' },
  { target_url: '#', desktop_image_url: '/images/SB_Cas_LR_Web.webp', mobile_image_url: '/images/SB_Cas_LR_Web.webp', alt: 'LR' },
  { target_url: '#', desktop_image_url: '/images/SB_Horse_Race_2025_Web.webp', mobile_image_url: '/images/SB_Horse_Race_2025_Web.webp', alt: 'Horse Race' },
  { target_url: '#', desktop_image_url: '/images/IMLT20_copy_(1).webp', mobile_image_url: '/images/IMLT20_copy_(1).webp', alt: 'IML T20' },
];

export default function HeroBanner({ slides }: HeroBannerProps) {
  const swiperRef = useRef<any>(null);
  const resolvedSlides = slides.length > 0 ? slides : DEFAULT_SLIDES;

  useEffect(() => {
    // Initialize Swiper after component mounts (swiper-bundle.min.js is loaded globally)
    const initSwiper = () => {
      if (typeof window !== 'undefined' && (window as any).Swiper) {
        swiperRef.current = new (window as any).Swiper('.main-banner-static', {
          slidesPerView: 1,
          loop: true,
          autoplay: { delay: 3000, disableOnInteraction: false },
          pagination: { el: '.swiper-pagination', clickable: true },
        });
      }
    };

    // Small delay to ensure DOM & Swiper script are ready
    const timer = setTimeout(initSwiper, 300);
    return () => {
      clearTimeout(timer);
      swiperRef.current?.destroy?.();
    };
  }, [resolvedSlides]);

  return (
    <div className="main-banner">
      <div className="mainslider-container">
        <div className="main-banner">
          <div className="swiper-container main-banner-static">
            <div className="swiper-wrapper">
              {resolvedSlides.map((slide, i) => (
                <div className="swiper-slide" key={i}>
                  <a href={slide.target_url}>
                    <img
                      className="banner-side"
                      src={slide.desktop_image_url}
                      alt={slide.alt || ''}
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  </a>
                </div>
              ))}
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
