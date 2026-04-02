'use client';
import React from 'react';
import Link from 'next/link';
import type { TopSport } from './types';

export default function TopSportsSection({ sports }: { sports: TopSport[] }) {
  return (
    <div className="bt_common_align" id="top_sports_slider_box">
      <div className="container-fluid">
        <div className="section_header_div">
          <div className="title">Top Sports</div>
        </div>

        <div className="swiper swiper-container single_layer">
          <div className="swiper-wrapper top_sports_wrapper" id="top_sports_slider">
            {sports.map((sport) => (
              <div className="swiper-slide" key={sport.name}>
                <Link href={sport.link} className="sport_category">
                  <img
                    src={sport.img}
                    className={`${sport.className} top-sport-thumb`}
                    loading="lazy"
                    alt={sport.name}
                    width={198}
                    height={279}
                  />
                  <div className="sport_name">{sport.name}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

