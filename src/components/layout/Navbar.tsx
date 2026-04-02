'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/store/authContext';
import { NAV_ITEMS, TIER_LABELS, TIER_IMAGES } from '@/config/constants';

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onDemoLogin: () => void;
}

function pathnameFromNavHref(href: string): string {
  if (href.startsWith('/')) {
    return href.split('?')[0].replace(/\/$/, '') || '/';
  }
  try {
    const u = new URL(href, 'http://localhost');
    return u.pathname.replace(/\/$/, '') || '/';
  } catch {
    return '/';
  }
}

function navItemIsActive(href: string, pathname: string | null): boolean {
  const itemPath = pathnameFromNavHref(href);
  const cur = (pathname || '/').replace(/\/$/, '') || '/';
  if (itemPath === '/') return cur === '/';
  return cur === itemPath || cur.startsWith(`${itemPath}/`);
}

export default function Navbar({ onLoginClick, onRegisterClick, onDemoLogin }: NavbarProps) {
  const { isLoggedIn, user, balance, messageCount, tierValue } = useAuth();
  const pathname = usePathname();
  const navLinkIsActive = (href: string) => navItemIsActive(href, pathname ?? null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Replicate jQuery dropdown toggle: user profile menu click → toggle open/show
  useEffect(() => {
    const profileMenu = profileMenuRef.current;
    const dropdown = dropdownRef.current;
    if (!profileMenu || !dropdown) return;

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      profileMenu.classList.toggle('open');
      dropdown.classList.toggle('show');
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (!profileMenu.contains(e.target as Node)) {
        profileMenu.classList.remove('open');
        dropdown.classList.remove('show');
      }
    };

    profileMenu.addEventListener('click', handleClick);
    document.addEventListener('click', handleOutsideClick);

    return () => {
      profileMenu.removeEventListener('click', handleClick);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    setIsNavOpen(false);
  }, [pathname]);

  const lastUrl = pathname?.replace('/', '') || '';

  return (
    <>
      {/* navbar starts */}
      <div className="navbar_sec">
        <div className="container-fluid">
          <nav className="navbar navbar-expand">
            <div className="nav_logo_btngrp_align">
              <Link className="navbar-brand" href="/">
                <img
                  src="/assets/FC100E65-Satbet-logo.png"
                  alt="logo"
                  loading="lazy"
                  width={150}
                  height={60}
                />
              </Link>
            </div>

            <button
              className="navbar-toggler"
              type="button"
              aria-controls="navbarTogglerDemo02"
              aria-expanded={isNavOpen}
              aria-label="Toggle navigation"
              onClick={() => setIsNavOpen((v) => !v)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse${isNavOpen ? ' show' : ''}`} id="navbarTogglerDemo02">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-dsktp-align navbar_menu_align position-relative">
                {NAV_ITEMS.map((item) => (
                  <li className="nav-item" key={item.label}>
                    <Link
                      className={`nav-link${navLinkIsActive(item.href) ? ' active' : ''}`}
                      aria-current={navLinkIsActive(item.href) ? 'page' : undefined}
                      href={item.href}
                    >
                      <div className="nav_menus">
                        <img
                          src={item.icon}
                          alt="icon"
                          width={26}
                          height={26}
                          className={item.className}
                          loading="lazy"
                          style={item.iconStyle}
                        />
                        <p>{item.label}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {isLoggedIn && user ? (
                /* Post-login header */
                <div className="header-inner-right-div d-flex align-items-center">
                  <div className="login-reg-section d-flex align-items-center">
                    <a
                      className="header_notify desktop_notify d-flex align-items-center position-relative"
                      href="/message"
                    >
                      <img
                        src="/images/notification_icon.svg"
                        alt="Notification Icon"
                        loading="lazy"
                        width={20}
                        height={20}
                      />
                      <span className="msg_count_no1 position-relative d-flex align-items-center justify-content-center mb-0 text-center">
                        {messageCount}
                      </span>
                    </a>

                    <div className="header_deposit_blnc_box d-flex align-items-center justify-content-between">
                      <a className="header_wallet header_deposit_btn_div" href="/deposit">
                        ₹ Deposit
                      </a>

                      <div className="header_blnc_div">
                        <img
                          className="header_wallet_icon"
                          src="/images/wallet_navbar.svg"
                          alt="userIcon"
                          loading="lazy"
                          width={20}
                          height={20}
                        />
                        <div className="header_bln_txt_div">
                          <a href="/wallet">Balance</a>
                          <span className="blnc_amt">₹ {balance}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="user_profile_menu userdtls_hdr22"
                      ref={profileMenuRef}
                    >
                      <img
                        className="header_usr_icon"
                        src="/images/usericon_navbar.svg"
                        alt="userIcon"
                        loading="lazy"
                        width={20}
                        height={20}
                      />
                      <img
                        className="userdtls_drop_icn"
                        src="/images/usericon_dropdown.svg"
                        alt="dropdown"
                        loading="lazy"
                        width={10}
                        height={10}
                      />

                      <div className="userdtls_hdr22_dropdown level_default" ref={dropdownRef}>
                        <div className="userdtls_hdr22_dropdown_head">
                          <div className="navdd_userdetails_section">
                            <div className="navdd_userdetails_content">
                              <div className="usr_ttle_msgnotify_div">
                                <div className="usr_ttle_22 usr_ttle_navdd">Hi, {user.username}</div>
                                <a className="header_notify" href="/message">
                                <img
                                    src="/images/notification_icon.svg"
                                    alt="Notification Icon"
                                    loading="lazy"
                                    width={20}
                                    height={20}
                                  />
                                  <span className="msg_count_no1">{messageCount}</span>
                                </a>
                              </div>
                              {tierValue > 0 && (
                                <div className="usr_ttle_22">
                                  <span>You are in the</span>{' '}
                                  {TIER_LABELS[tierValue]}{' '}
                                  <span>Tier</span>
                                </div>
                              )}
                            </div>
                            <div className="navdd_userdetails_image">
                              {tierValue > 0 && (
                                <img
                                  src={TIER_IMAGES[tierValue]}
                                  alt="icons"
                                  className="img-fluid"
                                  loading="lazy"
                                  width={60}
                                  height={60}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <ul>
                          {[
                            { href: '/withdraw', icon: 'withdraw_icon.svg', label: 'Withdraw' },
                            { href: '/bonus', icon: 'bonus_icon.svg', label: 'Bonus' },
                            { href: '/wallet', icon: 'wallet_icn.svg', label: 'Wallet' },
                            { href: '/profile', icon: 'profile_icon.svg', label: 'Profile' },
                            { href: '/kyc', icon: 'kyc_icon.svg', label: 'KYC' },
                            { href: '/transaction-history', icon: 'transactionhistory_icon.svg', label: 'Transaction history' },
                            { href: '/bank-information', icon: 'bank_icon.svg', label: 'Bank Information' },
                            { href: '/account-settings', icon: 'setting_icon.svg', label: 'Account Settings' },
                          ].map((item) => (
                            <li className="navdropdownbg" key={item.label}>
                              <a href={item.href}>
                                <img src={`/images/${item.icon}`} alt="Icon" loading="lazy" width={16} height={16} />
                                {item.label}
                                <img src="/images/dropright_icon.svg" alt="Icon" loading="lazy" width={8} height={8} />
                              </a>
                            </li>
                          ))}
                          <li
                            className="ddlogout_btn"
                            onClick={() => {
                              if (typeof window !== 'undefined') {
                                sessionStorage.removeItem('fcmtoken');
                              }
                            }}
                          >
                            <a href="/logout" className="logout_btn22">
                              <img src="/images/logout_1.svg" alt="Icon" loading="lazy" width={16} height={16} />
                              Logout
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Pre-login buttons */
                <div className="btn_grp_dskt">
                  <button className="btn signup_btn" id="demoUserLogin" type="button" onClick={onDemoLogin}>
                    Demo
                  </button>
                  <button
                    className="btn login_btn"
                    type="button"
                    onClick={onLoginClick}
                  >
                    Login
                  </button>
                  <button
                    className="btn signup_btn"
                    type="button"
                    onClick={onRegisterClick}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
      {/* navbar ends */}

      {/* Mobile nav menu */}
      <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul className="navbar-nav nav-mob-align navbar_menu_align position-relative">
          {NAV_ITEMS.map((item) => (
            <li className="nav-item" key={`mob-${item.label}`}>
              <Link
                className={`nav-link${navLinkIsActive(item.href) ? ' active' : ''}`}
                aria-current={navLinkIsActive(item.href) ? 'page' : undefined}
                href={item.href}
              >
                <div className="nav_menus">
                  <img
                    src={item.icon}
                    alt="icons"
                    className={item.className}
                    loading="lazy"
                    width={26}
                    height={26}
                    style={item.iconStyle}
                  />
                  <p>{item.label}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Game popup modal */}
      <div
        className="modal fade game_popup_modal"
        id="game_popup_modal"
        role="dialog"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <button type="button" className="close game-close">
              &times;
            </button>
            <div className="popup-content">
              <iframe src="" id="game-iframe-url" title="Game Play"></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
