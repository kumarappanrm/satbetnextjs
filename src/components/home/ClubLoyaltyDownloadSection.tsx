'use client';
import React from 'react';
import type { ClubTier } from './types';

type Props = {
  tiers: ClubTier[];
  onRegisterClick: () => void;
  levelImgPlaceholderSrc: string;
};

export default function ClubLoyaltyDownloadSection({ tiers, onRegisterClick, levelImgPlaceholderSrc }: Props) {
  return (
    <div className="bt_common_align">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="club_loyalty_bg">
              <div className="section_header_div">
                <div className="title club_title">Club Loyalty</div>
                <div className="swiper_btn_sec position-relative d-flex align-items-center club_loyalty_btn_sec position-relative d-flex align-items-center">
                  <div className="swiper-pagination-section">
                    <div className="swiper-button-prev swiper-button-prev6" tabIndex={0} role="button" aria-label="Previous slide">
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhAQMAAABtKlAsAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBgOAAAAxgAB/v0USgAAAABJRU5ErkJggg=="
                        alt="slide-arrow"
                        className="swiper-left-arrow slide_arrow level-right-arrow"
                        width={33}
                        height={33}
                      />
                    </div>
                    <div className="swiper-button-next swiper-button-next6" tabIndex={0} role="button" aria-label="Next slide">
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhAQMAAABtKlAsAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBgOAAAAxgAB/v0USgAAAABJRU5ErkJggg=="
                        alt="slide-arrow"
                        className="swiper-right-arrow slide_arrow level-right-arrow"
                        width={33}
                        height={33}
                      />
                    </div>
                  </div>
                  <a href="#" className="know_more_btn">
                    Know More
                  </a>
                  <button className="reg_btn" type="button" onClick={onRegisterClick}>
                    Register
                  </button>
                </div>
              </div>

              <div className="swiper swiper-container" id="club_loyalty_swipper">
                <div className="swiper-wrapper">
                  {tiers.map((t) => (
                    <div className="swiper-slide club_loyalty_slider_img d-flex justify-content-start" key={t.tier}>
                      <div className={`user_level_box ${t.boxClass}`}>
                        <div className="user_level_header_sec w-100 d-flex align-items-center justify-content-between">
                          <div className="user_level_left d-flex align-items-center">
                            <img
                              src={levelImgPlaceholderSrc}
                              className={`${t.levelClass} userlevel_image img fluid`}
                              alt="icon"
                              width={120}
                              height={120}
                              loading="lazy"
                            />
                            <div className="user_level_text d-flex flex-column">
                              <span>{t.tier}</span>
                              <span>Turn Over | {t.turnover}</span>
                            </div>
                          </div>
                          <div className="user_level_right">
                            <a href="#" className="tc_btn">
                              T &amp; C
                            </a>
                          </div>
                        </div>
                        <hr />
                        <div className="user_level_body_Sec">
                          <p>Benefits</p>
                          <ul>
                            {t.benefits.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="dwnld-main-div position-relative">
              <img
                src="/assets/49A03F72-satbet-sprite-7.png"
                className="img-fluid"
                alt="icon"
                width={850}
                height={473}
                loading="lazy"
              />
              <div className="dwnld_content_div position-absolute">
                <h1>Download The App</h1>
                <p>Now Download the SATBET APP and get easier, quickly access to your winings</p>
                <a href="#" className="reg_btn" id="install-pwd1">
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

