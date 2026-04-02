import Swiper from 'swiper';
import type { Swiper as SwiperInstance } from 'swiper';
import { Autoplay, Grid, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const modules = [Autoplay, Pagination, Navigation, Grid];

export function initHomeSwipers(): () => void {
  if (typeof window === 'undefined') return () => {};
  const instances: SwiperInstance[] = [];

  const safeCreate = (elOrSelector: string | HTMLElement, options: Record<string, unknown>) => {
    try {
      const instance = new Swiper(elOrSelector, {
        modules,
        ...options,
      });
      instances.push(instance);
      return instance;
    } catch {
      return null;
    }
  };

  if (document.querySelector('.herosec_swipper')) {
    safeCreate('.herosec_swipper', {
      autoplay: { delay: 3500, disableOnInteraction: false },
      pagination: { el: '.herosec_pagination', clickable: true },
      loop: true,
    });
  }

  const club = document.getElementById('club_loyalty_swipper');
  if (club) {
    safeCreate('#club_loyalty_swipper', {
      slidesPerView: 2.5,
      spaceBetween: 10,
      loop: true,
      navigation: { nextEl: '.swiper-button-next6', prevEl: '.swiper-button-prev6' },
    });
  }

  const initGridSwiper = (container: Element) => {
    const parent = container.closest('.bt_common_align') as Element | null;
    const nextEl = parent?.querySelector('.swiper-button-next') as Element | null;
    const prevEl = parent?.querySelector('.swiper-button-prev') as Element | null;
    const isSingle = container.classList.contains('single_layer');

    const instance = safeCreate(container as unknown as HTMLElement, {
      slidesPerView: 9.5,
      spaceBetween: 10,
      loop: false,
      navigation: nextEl && prevEl ? { nextEl, prevEl } : undefined,
      grid: { rows: 1, fill: 'row' },
      grabCursor: true,
      simulateTouch: true,
      observer: true,
      observeParents: true,
      breakpoints: {
        320: { slidesPerView: 2.5 },
        430: { slidesPerView: 3.5 },
        575: { slidesPerView: 3.5 },
        768: { slidesPerView: 5.5 },
        1024: { slidesPerView: isSingle ? 7.8 : 8 },
        2000: { slidesPerView: 15 },
        3000: { slidesPerView: isSingle ? 25 : 30 },
      },
    });

    try {
      instance?.slideTo?.(0, 0);
    } catch {
      // ignore
    }
  };

  document.querySelectorAll('.single_layer').forEach(initGridSwiper);
  document.querySelectorAll('.double_layer').forEach(initGridSwiper);

  return () => {
    instances.forEach((i) => {
      try {
        i?.destroy?.(true, true);
      } catch {
        // ignore
      }
    });
  };
}
