'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { FEATURES } from '@/config/features';

interface FooterProps {
  whatsappNewId?: string;
  whatsappSupport?: string;
  phoneDial?: string;
}

export default function Footer({
  whatsappNewId = 'https://linkli.in/NewId',
  whatsappSupport = 'https://linkli.in/suprt',
  phoneDial = '0008000404823',
}: FooterProps) {
  const IMG_PLACEHOLDER =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

  const handleWhatsAppNewId = () => {
    const responsePayload = { openwt: whatsappNewId };
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
      (window as any).ReactNativeWebView.postMessage(JSON.stringify(responsePayload));
    } else {
      window.location.href = whatsappNewId;
    }
  };

  const handleWhatsAppSupport = () => {
    const responsePayload = { openwt: whatsappSupport };
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
      (window as any).ReactNativeWebView.postMessage(JSON.stringify(responsePayload));
    } else {
      window.location.href = whatsappSupport;
    }
  };

  const handlePhoneDial = () => {
    const responsePayload = { opendl: phoneDial };
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
      (window as any).ReactNativeWebView.postMessage(JSON.stringify(responsePayload));
    } else {
      window.location.href = `tel:${phoneDial}`;
    }
  };

  useEffect(() => {
    // Checkbox backdrop for bottom nav chat menu (matches legacy HTML behavior)
    const checkbox = document.querySelector('.custom-checkbox') as HTMLInputElement | null;
    const backdrop = document.getElementById('backdrop-overlay');
    const whatsappClickPopup = document.getElementById('whatsapp_click_popup');

    if (!checkbox || !backdrop || !whatsappClickPopup) return;

    const handleCheckboxChange = () => {
      if (checkbox.checked) {
        backdrop.classList.remove('u-hidden');
      } else {
        backdrop.classList.add('u-hidden');
        whatsappClickPopup.classList.add('u-hidden');
      }
    };

    const handleBackdropClick = () => {
      checkbox.checked = false;
      backdrop.classList.add('u-hidden');
      whatsappClickPopup.classList.add('u-hidden');
    };

    checkbox.addEventListener('change', handleCheckboxChange);
    backdrop.addEventListener('click', handleBackdropClick);

    return () => {
      checkbox.removeEventListener('change', handleCheckboxChange);
      backdrop.removeEventListener('click', handleBackdropClick);
    };
  }, []);

  useEffect(() => {
    // WhatsApp popup toggle for nav menu items (matches legacy HTML behavior)
    const items = document.querySelectorAll('.custom-menu-item');
    const waPopup = document.getElementById('whatsapp_click_popup');

    const handleMenuClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      if (target.id === 'custom-menu-wa') {
        if (!waPopup) return;
        waPopup.classList.toggle('u-hidden');
      } else {
        waPopup?.classList.add('u-hidden');
      }
    };

    items.forEach((item) => item.addEventListener('click', handleMenuClick));
    return () => {
      items.forEach((item) => item.removeEventListener('click', handleMenuClick));
    };
  }, []);

  return (
    <>
      {/* footer starts (cloned from `satbet html/index.html`) */}
      <div className="container-fluid">
        <div className="footer_sec">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-6 d-flex align-items-center text-md-center">
              <div className="footer_payment_text">
                <p>Accept, process &amp; disburse digital payments for your business.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-6 d-flex align-items-center text-md-center paymentmethod_imgsec">
              <div className="footer_payment_images">
                {(
                  [
                    { cls: 'fp1', w: 94, h: 34 },
                    { cls: 'fp2', w: 94, h: 34 },
                    { cls: 'fp3', w: 94, h: 34 },
                    { cls: 'fp4', w: 94, h: 34 },
                    { cls: 'fp5', w: 94, h: 34 },
                    { cls: 'fp6', w: 94, h: 34 },
                  ] as const
                ).map((img) => (
                  <img
                    key={img.cls}
                    src={IMG_PLACEHOLDER}
                    alt="icon"
                    className={`${img.cls} sprite-pay`}
                    width={img.w}
                    height={img.h}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="footer_second_sec_align">
            <div className="row">
              <div className="col-12 col-md-4 col-lg-4 d-flex">
                <div className="footer_logo_section footer_sepline_mobile">
                  <div className="footer_logo">
                    <img
                      src={IMG_PLACEHOLDER}
                      alt=""
                      className="satbet-logo sprite-footer-logo"
                      width={200}
                      height={64}
                    />
                  </div>
                  <div className="footer_logo_section_content">
                    <p className="footer_fontsize">
                      We are Satbet, a friendly and honest online casino in India that delivers a great portfolio of
                      games, from slots to the latest live dealer titles. We believe in offering entertainment in a
                      secure environment and focus our efforts on providing fast and simple access for mobile gamblers
                      to enjoy
                    </p>
                  </div>
                  <div className="footer_logo_section_sm_icons">
                    {[
                      { href: 'https://linkli.in/suprt', cls: 'sm-icon1' },
                      { href: 'https://linkli.in/SBfacebook', cls: 'sm-icon2' },
                      { href: 'https://t.me/satbetofficial', cls: 'sm-icon3' },
                      { href: 'https://linkli.in/SBinsta', cls: 'sm-icon4' },
                      { href: 'https://linkli.in/SBx', cls: 'sm-icon5' },
                      { href: 'https://linkli.in/SBPinterest', cls: 'sm-icon6' },
                    ].map((sm) => (
                      <a key={sm.cls} href={sm.href}>
                        <img
                          src={IMG_PLACEHOLDER}
                          alt="icon"
                          className={`${sm.cls} sprite-sm`}
                          width={72}
                          height={72}
                        />
                      </a>
                    ))}
                    <a href="https://linkli.in/SByoutube">
                      <img src="/assets/28C3DE12-sb_youtube.png" alt="icon" width={72} height={72} className="sprite-sm" />
                    </a>
                    <a href="https://linkli.in/SBThread">
                      <img src="/assets/DF0FD0FA-sb_threads.png" alt="icon" width={72} height={72} className="sprite-sm" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-3 col-lg-3 d-flex justify-content-center">
                <div className="quicklink_Section quicklink_Section_desktp">
                  <div className="quicklink_header">
                    <p className="footer_fontsize">Quick Links</p>
                  </div>
                  <div className="quicklink_contents">
                    <div className="quicklink_set">
                      <a href="/about-us"><p className="footer_fontsize">About Us</p></a>
                      <a href="/terms-and-conditions"><p className="footer_fontsize">Terms &amp; Conditions</p></a>
                      <a href="/affiliates"><p className="footer_fontsize">Affiliates</p></a>
                      <a href="/disclaimer"><p className="footer_fontsize">Disclaimer</p></a>
                      <a href="/responsible-gaming"><p className="footer_fontsize">Responsible Gaming</p></a>
                    </div>
                    <div className="quicklink_set">
                      <a href="/kyc-policy"><p className="footer_fontsize">KYC</p></a>
                      <a href="/privacy-policy"><p className="footer_fontsize">Privacy Policy</p></a>
                      <a href="/contact-us"><p className="footer_fontsize">Contact Us</p></a>
                      <a href="/sitemap"><p className="footer_fontsize">Site Map</p></a>
                      <a href="/casino-games"><p className="footer_fontsize">Casino</p></a>
                    </div>
                  </div>
                </div>

                <div className="quicklink_Section quicklink_Section_mobile footer_sepline_mobile footer_sepline_mobile1">
                  <a href="/about-us">
                    <p className="footer_fontsize quicklink_mobile">
                      <span className="quicklink_header">Quick Links: </span>About Us
                    </p>
                  </a>
                  <p></p>
                  <a href="/terms-and-conditions"><p className="footer_fontsize quicklink_mobile">Terms &amp; Conditions</p></a>
                  <a href="/affiliates"><p className="footer_fontsize quicklink_mobile">Affiliates</p></a>
                  <a href="/disclaimer"><p className="footer_fontsize quicklink_mobile">Disclaimer</p></a>
                  <a href="/responsible-gaming"><p className="footer_fontsize quicklink_mobile">Responsible Gaming</p></a>
                  <a href="/kyc-policy"><p className="footer_fontsize quicklink_mobile">KYC</p></a>
                  <a href="/privacy-policy"><p className="footer_fontsize quicklink_mobile">Privacy Policy</p></a>
                  <a href="/contact-us"><p className="footer_fontsize quicklink_mobile">Contact Us</p></a>
                  <a href="/sitemap"><p className="footer_fontsize quicklink_mobile">Site Map</p></a>
                  <a href="/casino-games"><p className="footer_fontsize quicklink_mobile quicklink_mobile_lastchild">Casino</p></a>
                </div>
              </div>

              <div className="col-12 col-md-5 col-lg-5 d-flex">
                <div className="disclaimer_section">
                  <div className="disclaimer_content">
                    <p className="footer_fontsize footer_fontsize_mob_align footer_fontsize_mob_align1">
                      <a id="siteUrl_footer" href="http://localhost:3000/">localhost:3000</a> is operated by Leaning Tech Limited
                      registered under No.15481384 at 85 Great Portland Street, London, England.
                    </p>
                    <p className="footer_fontsize footer_fontsize_mob_align">
                      <span>Disclaimer:</span> Please note that Gaming involves a financial risk &amp; could be addictive
                      over time if not practises within limits. Only 18+ people should use the services &amp; should use
                      it responsibly. Players should be aware of any financial risk and govern themselves accordingly.
                    </p>
                  </div>
                  <div className="disclaimer_images">
                    {[
                      { cls: 'img-18plus', w: 44, h: 44 },
                      { cls: 'footer-certify-img3', w: 37, h: 39 },
                      { cls: 'footer-certify-img4', w: 93, h: 35 },
                      { cls: 'footer-certify-img5', w: 46, h: 49 },
                      { cls: 'footer-certify-img6', w: 48, h: 47 },
                      { cls: 'footer-certify-img7', w: 50, h: 49 },
                      { cls: 'footer-certify-img8', w: 52, h: 52 },
                      { cls: 'footer-certify-img9', w: 61, h: 34 },
                    ].map((img) => (
                      <img
                        key={img.cls}
                        src={IMG_PLACEHOLDER}
                        alt="icon"
                        className={`${img.cls} sprite-ib`}
                        width={img.w}
                        height={img.h}
                        style={{ width: img.w, height: img.h }}
                      />
                    ))}
                  </div>
                  <p className="disclaimer_content_secondarytext">&copy; 2025 Satbet. All Rights Reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* footer ends */}

      {/* bottom nav starts (cloned from `satbet html/index.html`) */}
      <div className="backdrop-overlay u-hidden" id="backdrop-overlay" />

      <div className="custom-bottom-nav">
        <div className="custom-nav-slot custom-bg-primary custom-round-left">
          <Link href="/" className="custom-nav-link custom-link-home">
            <img src="/assets/3DC97420-gold_home.png" alt="icons" loading="lazy" />
          </Link>
          <p className="custom-label-home">Home</p>
        </div>
        <div className="custom-nav-slot custom-bg-primary">
          <Link href="/live-casino-games" className="custom-nav-link custom-link-casino">
            <img src="/assets/34D869B9-white_casino.png" alt="icons" loading="lazy" />
          </Link>
          <p className="custom-label-casino">All Casino</p>
        </div>
        <div className="custom-nav-slot custom-curve-slot">
          <nav className="custom-menu">
            <input type="checkbox" className="custom-checkbox" />
            <div className="custom-checkbox-list">
              <a className="custom-menu-item custom-menu-tele" onClick={handlePhoneDial} id="custom-menu-tele">
                <img src="/assets/9E76CA87-bn_tele.png" alt="icons" loading="lazy" />
              </a>
              <button className="custom-menu-item custom-menu-wa" id="custom-menu-wa">
                <img src="/assets/BDC2541-bn_wa.png" alt="icons" loading="lazy" />
              </button>
              {FEATURES.tawkChatButton ? (
                <button
                  className="custom-menu-item custom-menu-bot"
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
                      (window as any).Tawk_API.toggle();
                    }
                  }}
                  id="custom-menu-bot"
                >
                  <img src="/assets/C5D54C68-bn_bot.png" alt="icons" loading="lazy" />
                </button>
              ) : null}
              <div className="bg_curve">
                <img src="/assets/DEFA91F6-bn_bend.png" alt="icons" className="custom_chat_bg_mobile" />
                <img src="/assets/91746C07-bn_bend_desktop.png" alt="icons" className="custom_chat_bg_desk" />
              </div>
            </div>
          </nav>
          <p className="custom-label-chat">Chats</p>
        </div>
        <div className="custom-nav-slot custom-bg-primary">
          <Link href="/sportsbook" className="custom-nav-link custom-link-sports">
            <img src="/assets/67AA170D-white_sports.png" alt="icons" loading="lazy" />
          </Link>
          <p className="custom-label-sports">Sports</p>
        </div>
        <div className="custom-nav-slot custom-bg-primary custom-round-right">
          <Link href="/menu" className="custom-nav-link custom-link-menu">
            <img src="/assets/EBD80122-bn_menu.png" alt="icons" loading="lazy" />
          </Link>
          <p className="custom-label-menu">Menu</p>
        </div>

        <div className="whatsapp_click_popup u-hidden" id="whatsapp_click_popup">
          <div
            className="close"
            onClick={() => {
              const popup = document.getElementById('whatsapp_click_popup');
              popup?.classList.add('u-hidden');
            }}
            data-dismiss="modal"
            aria-label="Close"
          >
            <img src="/assets/59CE17CE-close_btn.svg" alt="icons" loading="lazy" />
          </div>
          <p>Select</p>
          <div className="bn_btn_grp">
            <button type="button" id="new_id" onClick={handleWhatsAppNewId}>
              <img src="/assets/A857F476-suwa.png" alt="icons" loading="lazy" />
              Get a New ID
            </button>
            <button type="button" id="support_id" onClick={handleWhatsAppSupport}>
              <img src="/assets/A857F476-suwa.png" alt="icons" loading="lazy" />
              Get Support
            </button>
          </div>
        </div>
      </div>
      {/* bottom nav ends */}
    </>
  );
}
