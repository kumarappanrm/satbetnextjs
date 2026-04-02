'use client';
import React, { useState, useEffect } from 'react';
import { APP_CONFIG } from '@/config/constants';
import { useModalTransition } from '@/hooks/useModalTransition';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({ show, onClose, onLoginSuccess }: LoginModalProps) {
  const { shouldRender, visible } = useModalTransition(show);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Reset form on close
  useEffect(() => {
    if (!show) {
      setUsername('');
      setPassword('');
      setUsernameError('');
      setPasswordError('');
      setLoginError('');
      setLoading(false);
    }
  }, [show]);

  useEffect(() => {
    if (!shouldRender) return;
    const prevOverflow = document.body.style.overflow;
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = prevOverflow;
    };
  }, [shouldRender]);

  const handleLogin = async () => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');
    setLoginError('');

    if (username.trim() === '') {
      setUsernameError('Username is required');
      isValid = false;
    } else if (username.length < APP_CONFIG.USERNAME_MINLENGTH) {
      setUsernameError(`Username must be at least ${APP_CONFIG.USERNAME_MINLENGTH} characters`);
      isValid = false;
    } else if (username.length > APP_CONFIG.USERNAME_MAXLENGTH) {
      setUsernameError(`Username cannot exceed ${APP_CONFIG.USERNAME_MAXLENGTH} characters`);
      isValid = false;
    }

    if (password.trim() === '') {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < APP_CONFIG.USERPASSWORD_MINLENGTH) {
      setPasswordError(`Password must be at least ${APP_CONFIG.USERPASSWORD_MINLENGTH} characters`);
      isValid = false;
    } else if (password.length > APP_CONFIG.USERPASSWORD_MAXLENGTH) {
      setPasswordError(`Password cannot exceed ${APP_CONFIG.USERPASSWORD_MAXLENGTH} characters`);
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const res = await fetch(`${APP_CONFIG.BASE_URL}user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      const data = await res.json();

      if (!data.error) {
        sessionStorage.removeItem('_cltk');
        sessionStorage.removeItem('fcmtoken');
        const redirectUrl = decodeURIComponent(data.redirect);
        window.location.href = redirectUrl;
      } else {
        setLoginError(data.message || 'Login failed');
        setTimeout(() => setLoginError(''), 3000);
      }
    } catch {
      setLoginError('Something went wrong with the network. Kindly refresh and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`modal-backdrop fade satbet-modal-backdrop ${visible ? 'show satbet-modal-backdrop--open' : ''}`}
        onClick={onClose}
        aria-hidden={!visible}
      />

      <div
        className={`modal fade logsign-modal satbet-modal-panel ${visible ? 'show in satbet-modal-panel--open' : ''}`}
        id="loginModal"
        tabIndex={-1}
        aria-labelledby="loginModalLabel"
        aria-hidden={!visible}
        style={{ display: 'block' }}
      >
        <div className="modal-dialog modal-dialog-custom">
          <div className="login_box">
            <div className="login_leftimg">
              <img src="/assets/CF02FCB1-login_banner.jpg" alt="" loading="lazy" />
            </div>
            <div className="login_leftimg_mob">
              <img src="/assets/8C69B9E3-banner_mobile.webp" alt="" loading="lazy" />
            </div>

            <div className="login-div d-flex align-items-center flex-column justify-content-center position-relative satbet-form-busy-wrap">
              {loading ? (
                <div className="satbet-form-busy-overlay" aria-busy="true" aria-live="polite">
                  <div className="satbet-form-busy-spinner" />
                  <span className="satbet-form-busy-label">Signing in…</span>
                </div>
              ) : null}
              <div className="close close-login position-absolute" onClick={onClose} aria-label="Close">
                <img src="/assets/59CE17CE-close_btn.svg" alt="" loading="lazy" />
              </div>

              <div className="login_logo">
                <img src="/assets/FC100E65-Satbet-logo.png" alt="logo" width={150} height={48} loading="lazy" />
              </div>

              <div className="satbet-container">
                <div className="satbet-tabs d-flex justify-content-center">
                  <div className="satbet-tab satbet-tab-active text-center" id="login-tab">Login</div>
                </div>

                <form
                  action={`${APP_CONFIG.BASE_URL}user/login`}
                  className="form"
                  id="loginForm"
                  autoComplete="off"
                  method="post"
                  acceptCharset="utf-8"
                  noValidate
                  onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
                >
                  <div className="form_group">
                    <div className="col-12 form_mob_align">
                      <label className="login-error lebel-error error position-relative bottom-0" htmlFor="login">
                        {loginError}
                      </label>
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                          <img src="/assets/766F716B-loginusericon.png" alt="" loading="lazy" />
                          </span>
                        <div className="form-floating form-floating-custom">
                          <input
                            type="text"
                            className="form-control form-control-custom"
                            id="username"
                            placeholder=""
                            name="username"
                            minLength={APP_CONFIG.USERNAME_MINLENGTH}
                            maxLength={APP_CONFIG.USERNAME_MAXLENGTH}
                            autoComplete="off"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                          <label htmlFor="username">Username</label>
                        </div>
                        <label id="username-error" className="lebel-error error" htmlFor="username">
                          {usernameError}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form_group">
                    <div className="input-group mb-3">
                      <span className="input-group-text">
                        <img src="/assets/CAE3D0C4-password_loginicon.png" alt="" loading="lazy" />
                      </span>
                      <div className="form-floating form-floating-custom">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control form-control-custom"
                          id="password"
                          placeholder=""
                          name="password"
                          minLength={APP_CONFIG.USERPASSWORD_MINLENGTH}
                          maxLength={APP_CONFIG.USERPASSWORD_MAXLENGTH}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="floatingInputGroup1">Password</label>
                        <img
                          src="/assets/53792E26-password_eye_close.png"
                          data-openeye="/assets/password_eye.png"
                          data-closeeye="/assets/53792E26-password_eye_close.png"
                          className="position-absolute password_eye"
                          alt="show password"
                          loading="lazy"
                          onClick={() => setShowPassword((v) => !v)}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                    <label id="password-error" className="lebel-error error" htmlFor="password">
                      {passwordError}
                    </label>
                  </div>

                  <div className="satbet-login-help text-center">
                    <div>
                      Assistance for resolving login issues.{' '}
                      <button className="need-help" type="button">
                        <a href="https://linkli.in/Help">Need Help?</a>
                      </button>
                    </div>
                  </div>

                  <div className="col-12 form_mob_align">
                    <button
                      type="button"
                      className={`login-btn login-btn-form${loading ? ' satbet-login-btn-loading' : ''}`}
                      id="login_btn"
                      onClick={handleLogin}
                      disabled={loading}
                    >
                      <span>{loading ? 'Please wait…' : 'Login'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
