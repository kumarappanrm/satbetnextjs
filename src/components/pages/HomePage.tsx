'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginModal from '@/components/forms/LoginModal';
import SignupModal from '@/components/forms/SignupModal';
import HeroBanner from '@/components/home/HeroBanner';
import TopSportsSection from '@/components/home/TopSportsSection';
import GamesSliderSection from '@/components/home/GamesSliderSection';
import ProvidersSection from '@/components/home/ProvidersSection';
import HowToPlaySection from '@/components/home/HowToPlaySection';
import ClubLoyaltyDownloadSection from '@/components/home/ClubLoyaltyDownloadSection';
import { APP_CONFIG } from '@/config/constants';
import { FEATURES } from '@/config/features';
import { initHomeSwipers } from '@/lib/homeSwipers';
import type { HeroSlide, ClubTier, GameCard, ProviderCard, TopSport } from '@/components/home/types';

/** Used when NEXT_PUBLIC_ENABLE_REMOTE_GAME_CDN_IMAGES=false */
const REMOTE_GAME_CDN_PLACEHOLDER =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC';

function withLocalGameThumbnails<T extends { img: string }>(games: T[]): T[] {
  if (FEATURES.remoteGameCdnImages) return games;
  return games.map((g) =>
    /^https?:\/\//i.test(g.img) ? { ...g, img: REMOTE_GAME_CDN_PLACEHOLDER } : g
  );
}

const HERO_SLIDES: HeroSlide[] = [
  { href: 'https://bit.ly/SB_Bonus', src: '/assets/BD48183D-Aquisition_WEB_1_7a1eac9163.webp', alt: 'CASINO & SPORTS 5%' },
  { href: 'https://bit.ly/SB_Casinogames', src: '/assets/18EF70AB-Retention_Crazy_Time_WEB_2_e3d1ae2432.webp', alt: 'Crazy Time 2%' },
  { href: 'https://bit.ly/SB_CurrentEvent', src: '/assets/BD4DB40C-WPL_WEB_19_414e14713f.webp', alt: 'WPL' },
  { href: 'https://bit.ly/SB_CurrentEvent', src: '/assets/A31F57-T20_WEB_6_3731f6122c.webp', alt: 'World Cup' },
  { href: 'https://bit.ly/SB_Casinogames', src: '/assets/22CF4B65-Crazy_Time_WEB_8_5474089c4c.webp', alt: 'Crazy Time' },
  { href: '#', src: '/assets/9882DBB-Celebrity_WEB_f7162de8cf.webp', alt: 'Celeb Banner' },
];

const CLUB_LEVEL_IMG_PLACEHOLDER =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4AQMAAAADqqSRAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABdJREFUeNpjYBgFo2AUjIJRMApGAb0BAAeAAAGB8v1lAAAAAElFTkSuQmCC';

const TOP_SPORTS: TopSport[] = [
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAAEXAQMAAADMQKkgAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB5JREFUeNrtwYEAAAAAw6D5U9/gBFUBAAAAAAAAPAMcVgAB6AAwugAAAABJRU5ErkJggg==', className: 'group-480987684', name: 'Cricket', link: '/exchange' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAAEXAQMAAADMQKkgAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB5JREFUeNrtwYEAAAAAw6D5U9/gBFUBAAAAAAAAPAMcVgAB6AAwugAAAABJRU5ErkJggg==', className: 'group-48099031', name: 'Football', link: '/sportsbook' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAAEXAQMAAADMQKkgAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB5JREFUeNrtwYEAAAAAw6D5U9/gBFUBAAAAAAAAPAMcVgAB6AAwugAAAABJRU5ErkJggg==', className: 'group-48099032', name: 'Tennis', link: '/sportsbook' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAAEXAQMAAADMQKkgAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB5JREFUeNrtwYEAAAAAw6D5U9/gBFUBAAAAAAAAPAMcVgAB6AAwugAAAABJRU5ErkJggg==', className: 'group-48099036', name: 'Basket ball', link: '/sportsbook' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAAEXAQMAAADMQKkgAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB5JREFUeNrtwYEAAAAAw6D5U9/gBFUBAAAAAAAAPAMcVgAB6AAwugAAAABJRU5ErkJggg==', className: 'group-48099034', name: 'Rugby', link: '/sportsbook' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAAEXAQMAAADMQKkgAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB5JREFUeNrtwYEAAAAAw6D5U9/gBFUBAAAAAAAAPAMcVgAB6AAwugAAAABJRU5ErkJggg==', className: 'group-48099035', name: 'Baseball', link: '/sportsbook' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAAEXAQMAAADMQKkgAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB5JREFUeNrtwYEAAAAAw6D5U9/gBFUBAAAAAAAAPAMcVgAB6AAwugAAAABJRU5ErkJggg==', className: 'group-48099022', name: 'Hockey', link: '/sportsbook' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAAEXAQMAAADMQKkgAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB5JREFUeNrtwYEAAAAAw6D5U9/gBFUBAAAAAAAAPAMcVgAB6AAwugAAAABJRU5ErkJggg==', className: 'group-48098768', name: 'Table Tennis', link: '/sportsbook' },
];

const POPULAR_CASINO_GAMES: GameCard[] = [
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'spb-aviator', name: 'Aviator', id: 'aviator' },
  { img: 'https://prod.bollytech.com/topspingames/images/ts-tg-paperplane.jpg', className: 'spb-aviator', name: 'Paper Plane', id: 'ts-tg-paperplane' },
  { img: 'https://prod.bollytech.com/topspingames/images/sx-sg-jackpotpinball.jpg', className: 'spb-aviator', name: 'Jackpot Pinball', id: 'sx-sg-jackpotpinball' },
  { img: 'https://prod.bollytech.com/topspingames/images/sx-sg-ninjasfortune.jpg', className: 'spb-aviator', name: 'Ninja Fortune', id: 'sx-sg-ninjasfortune' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'jetx3', name: 'JetX3', id: 'JetX3' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'balloon', name: 'Balloon', id: 'Balloon' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'jetx', name: 'JetX', id: 'JetX' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'tk-midasgoldentouch', name: 'Midas Golden Touch', id: 'TK-midasgoldentouch' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-1000148', name: 'Crazy Time', id: '1000148' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-1000074', name: 'Dragon Tiger', id: '1000074' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-1000609', name: 'Lightning Sic Bo', id: '1000609' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-1000610', name: 'Lightning Storm Live', id: '1000610' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-1000608', name: 'FP Hilo', id: '1000608' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-1000607', name: 'Balloon Race', id: '1000607' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-1000605', name: 'Lightning Dragon Tiger', id: '1000605' },
];

const NEW_GAMES: GameCard[] = [
  { img: 'https://prod.bollytech.com/topspingames/images/ts-tg-bhanumati-magic-box-mine.jpg', className: 'evp-aeronauts', name: 'Bhanumati Magic box Mine', id: 'ts-tg-bhanumati-magic-box-mine' },
  { img: 'https://prod.bollytech.com/supernowagames/images/1000148.jpg', className: 'evp-aeronauts', name: 'Crazy Time', id: '1000148' },
  { img: 'https://prod.bollytech.com/topspingames/images/ts-tg-airavat.jpg', className: 'evp-aeronauts', name: 'Airavat – The White Elephant', id: 'ts-tg-airavat' },
  { img: 'https://prod.bollytech.com/topspingames/images/ts-tg-supersixermines.jpg', className: 'evp-aeronauts', name: 'Super Sixer Mines', id: 'ts-tg-supersixermines' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'evp-aeronauts', name: 'Aero', id: 'EVP-aeronauts' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-92037', name: 'Matka', id: '920371' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-119102', name: 'VIP Vault Roulette', id: '119102' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-119802', name: 'Space Ball Roulette', id: '119802' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'rl-24', name: '500x Cyber Auto Roulette', id: 'rl-24' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-1179994', name: 'Buccaneer Bash', id: '1179994' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-1179992', name: 'Goblins: Gluttony of Gems', id: '1179992' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-1179979', name: 'Shelltastic Wins!', id: '1179979' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-87564', name: 'Andar Bahar', id: '875641' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-2293765', name: 'Teen Patti', id: '2293765' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'img-40fr', name: '40 Fruity Reels', id: '40fr' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC', className: 'ts-tg-supersixer-classicscratch', name: 'Super Sixer Classic Scratch', id: 'ts-tg-supersixer_classicscratch' },
];

const POPULAR_GAMES_FOR_VIEW = withLocalGameThumbnails(POPULAR_CASINO_GAMES);
const NEW_GAMES_FOR_VIEW = withLocalGameThumbnails(NEW_GAMES);

const PROVIDERS: ProviderCard[] = [
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAABeAQMAAAAkOgVnAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABZJREFUeNpjYBgFo2AUjIJRMApGEgAABvoAAVpwYDkAAAAASUVORK5CYII=', className: 'providers-img-4', name: 'Evolution', link: '/live-casino-games/evolution' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAABeAQMAAAAkOgVnAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABZJREFUeNpjYBgFo2AUjIJRMApGEgAABvoAAVpwYDkAAAAASUVORK5CYII=', className: 'providers-img-5', name: 'Ezugi', link: '/live-casino-games/ezugi' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAABeAQMAAAAkOgVnAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABZJREFUeNpjYBgFo2AUjIJRMApGEgAABvoAAVpwYDkAAAAASUVORK5CYII=', className: 'providers-img-8', name: 'RTG Slots', link: '/casino-games/rtg-slots' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAABeAQMAAAAkOgVnAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABZJREFUeNpjYBgFo2AUjIJRMApGEgAABvoAAVpwYDkAAAAASUVORK5CYII=', className: 'providers-img-10', name: 'Supernowa', link: '/live-casino-games/supernowa' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAABeAQMAAAAkOgVnAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABZJREFUeNpjYBgFo2AUjIJRMApGEgAABvoAAVpwYDkAAAAASUVORK5CYII=', className: 'providers-img-2', name: 'Aura', link: '/casino-games' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAABeAQMAAAAkOgVnAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABZJREFUeNpjYBgFo2AUjIJRMApGEgAABvoAAVpwYDkAAAAASUVORK5CYII=', className: 'providers-img-1', name: '7mojos', link: '/live-casino-games/7-mojo' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAABeAQMAAAAkOgVnAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABZJREFUeNpjYBgFo2AUjIJRMApGEgAABvoAAVpwYDkAAAAASUVORK5CYII=', className: 'providers-img-7', name: 'Pragmatic Play', link: '/casino-games' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAABeAQMAAAAkOgVnAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABZJREFUeNpjYBgFo2AUjIJRMApGEgAABvoAAVpwYDkAAAAASUVORK5CYII=', className: 'providers-img-9', name: 'Smartsoft', link: '/casino-games/smartsoft' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAABeAQMAAAAkOgVnAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABZJREFUeNpjYBgFo2AUjIJRMApGEgAABvoAAVpwYDkAAAAASUVORK5CYII=', className: 'providers-img-6', name: 'Only Play', link: '/casino-games/only-play' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAABeAQMAAAAkOgVnAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABZJREFUeNpjYBgFo2AUjIJRMApGEgAABvoAAVpwYDkAAAAASUVORK5CYII=', className: 'providers-img', name: 'XPG', link: '/casino-games' },
  { img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAABeAQMAAAAkOgVnAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABZJREFUeNpjYBgFo2AUjIJRMApGEgAABvoAAVpwYDkAAAAASUVORK5CYII=', className: 'providers-img-3', name: 'AWC', link: '/live-casino-games/awc' },
];

const CLUB_TIERS: ClubTier[] = [
  {
    tier: 'Silver',
    turnover: '₹1k',
    boxClass: 'user_silver',
    levelClass: 'level-silver',
    benefits: [
      '3% Bonus on every Deposit',
      '2% Weekly Lossback bonus for Live Casino and  Live Cards',
      '2% Weekly Lossback bonus for SportsBook',
    ],
  },
  {
    tier: 'Gold',
    turnover: '₹10L',
    boxClass: 'user_gold',
    levelClass: 'level-gold',
    benefits: [
      '4% Bonus on every Deposit',
      '2% Weekly Lossback bonus for Live Casino and  Live Cards',
      '2% Weekly Lossback bonus for SportsBook',
    ],
  },
  {
    tier: 'Platinum',
    turnover: '₹50L',
    boxClass: 'user_platinum',
    levelClass: 'level-platinum',
    benefits: [
      '5% Bonus on every Deposit',
      '2% Weekly Lossback bonus for Live Casino and  Live Cards',
      '2% Weekly Lossback bonus for SportsBook',
    ],
  },
  {
    tier: 'VIP',
    turnover: '₹1CR',
    boxClass: 'user_vip',
    levelClass: 'level-vip',
    benefits: [
      '6% Bonus on every Deposit',
      '3% Weekly Lossback bonus for Live Casino and  Live Cards',
      '3% Weekly Lossback bonus for SportsBook',
    ],
  },
];

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const cleanup = initHomeSwipers();
    return cleanup;
  }, []);

  const handleDemoLogin = useCallback(async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', APP_CONFIG.DEMO_USERNAME);
      formData.append('password', APP_CONFIG.DEMO_USER_PASSWORD);

      const res = await fetch(`${APP_CONFIG.BASE_URL}user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      const data = await res.json();
      if (!data.error) {
        const redirectUrl = decodeURIComponent(data.redirect);
        window.location.href = redirectUrl;
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <main>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowSignup(true)}
        onDemoLogin={handleDemoLogin}
      />

      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} onLoginSuccess={() => setShowLogin(false)} />
      <SignupModal show={showSignup} onClose={() => setShowSignup(false)} />

      <HeroBanner slides={HERO_SLIDES} />
      <TopSportsSection sports={TOP_SPORTS} />

      {/* Exchange widget */}
      <div className="bt_common_align exchange_class" id="exchange_widget_box" style={{ display: 'none' }}>
        <div className="container-fluid">
          <div className="section_container">
            <div className="section_header_div">
              <div className="title">Exchange</div>
            </div>
            <div className="exch_iframe_main">
              <iframe
                className="exchange_iframe"
                id="exchangeframeLeft"
                data-hj-allow-iframe="true"
                title="Exchange"
                src={FEATURES.embeddedExchangeIframe ? 'https://widgetjf.goldenspin.co/' : 'about:blank'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sportsbook widget */}
      <div className="bt_common_align" id="sportsbook_widget_box">
        <div className="container-fluid">
          <div className="section_container">
            <div className="section_header_badge_div">
              <div className="title-badge">Sportsbook</div>
            </div>
            <div className="sportsbook_iframe_main">
              <Link href="/sportsbook" className="sportsbook_link" />
              <iframe className="sportsbook_iframe" id="frameLeft" data-hj-allow-iframe="true" src=""></iframe>
            </div>
          </div>
        </div>
      </div>

      <GamesSliderSection
        boxId="popular_casino_games_slider_box"
        title="Popular Casino Games"
        sliderId="popular_casino_games_slider"
        seeAllHref="/casino-games"
        games={POPULAR_GAMES_FOR_VIEW}
      />

      <GamesSliderSection
        boxId="new_games_slider_box"
        title="New Games"
        sliderId="new_games_slider"
        seeAllHref="/casino-games"
        games={NEW_GAMES_FOR_VIEW}
      />

      <ProvidersSection providers={PROVIDERS} boxId="game_provider_slider_box" />

      <HowToPlaySection />

      <ClubLoyaltyDownloadSection
        tiers={CLUB_TIERS}
        onRegisterClick={() => setShowSignup(true)}
        levelImgPlaceholderSrc={CLUB_LEVEL_IMG_PLACEHOLDER}
      />

      <Footer />
    </main>
  );
}
