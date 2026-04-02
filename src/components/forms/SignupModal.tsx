'use client';
import React, { useState, useEffect } from 'react';
import { APP_CONFIG } from '@/config/constants';
import { useModalTransition } from '@/hooks/useModalTransition';

interface SignupModalProps {
  show: boolean;
  onClose: () => void;
}

export default function SignupModal({ show, onClose }: SignupModalProps) {
  const { shouldRender, visible } = useModalTransition(show);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [countryCode] = useState('+91');
  const [terms, setTerms] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!show) {
      setUsername(''); setPassword(''); setConfirmPassword('');
      setMobileNo(''); setTerms(false); setOtp('');
      setShowOtp(false); setOtpSent(false); setOtpVerified(false);
      setErrors({}); setLoading(false); setTimerActive(false); setTimerSeconds(120);
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

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setTimerSeconds((s) => {
        if (s <= 1) { clearInterval(interval); setTimerActive(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleMobileInput = (val: string) => {
    const numeric = val.replace(/\D/g, '');
    setMobileNo(numeric.slice(0, 10));
  };

  const handleSendOtp = async () => {
    if (!mobileNo || mobileNo.length < 10 || !username) return;
    try {
      const res = await fetch(`${APP_CONFIG.BASE_URL}user/register/send_mobileno_otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ mobileCode: countryCode, mobileNo, username }).toString(),
      });
      const msg = await res.json();
      if (msg.response === 1) {
        setShowOtp(true); setOtpSent(true);
        setTimerSeconds(120); setTimerActive(true);
      }
    } catch {}
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch(`${APP_CONFIG.BASE_URL}user/register/verify_mobileno_otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ OtpNo: otp, mobileCode: countryCode, mobileNo }).toString(),
      });
      const msg = await res.json();
      if (msg.response === 1) { setOtpVerified(true); setTimerActive(false); }
    } catch {}
  };

  const formatTimer = () => {
    const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
    const s = (timerSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSignup = async () => {
    const newErrors: Record<string, string> = {};
    const passRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@*\-_])[a-z0-9@*\-_]{6,15}$/;

    if (!username.trim()) newErrors.username = 'Username is required';
    else if (username.length < APP_CONFIG.USERNAME_MINLENGTH) newErrors.username = `Min ${APP_CONFIG.USERNAME_MINLENGTH} characters`;
    else if (username.length > APP_CONFIG.USERNAME_MAXLENGTH) newErrors.username = `Max ${APP_CONFIG.USERNAME_MAXLENGTH} characters`;

    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < APP_CONFIG.USERPASSWORD_MINLENGTH) newErrors.password = `Min ${APP_CONFIG.USERPASSWORD_MINLENGTH} characters`;
    else if (password.length > APP_CONFIG.USERPASSWORD_MAXLENGTH) newErrors.password = `Max ${APP_CONFIG.USERPASSWORD_MAXLENGTH} characters`;
    else if (!passRegex.test(password)) newErrors.password = 'Password must contain letters, numbers, and a special character';

    if (confirmPassword !== password) newErrors.c_password = 'Passwords do not match';

    if (!mobileNo.trim()) newErrors.mobile_no = 'Mobile number is required';
    else if (!/^\d{10}$/.test(mobileNo)) newErrors.mobile_no = 'Mobile number must be 10 digits';
    else if (!/^[6-9]/.test(mobileNo)) newErrors.mobile_no = 'Mobile number must start with 6-9';

    if (!terms) newErrors.terms = 'Please agree to Terms & Conditions';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const formData = new URLSearchParams({
        username, password, c_password: confirmPassword,
        mobile_no: mobileNo, country_code: countryCode,
        terms: terms ? '1' : '0',
      });
      const res = await fetch(`${APP_CONFIG.BASE_URL}user/register/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      const response = await res.json();
      if (!response.error) {
        window.location.href = decodeURIComponent(response.url);
      } else {
        setErrors({ terms: response.message });
        setTimeout(() => setErrors({}), 3000);
      }
    } catch {
      setErrors({ terms: 'Something went wrong. Please try again.' });
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
        id="signupModal"
        tabIndex={-1}
        aria-hidden={!visible}
        style={{ display: 'block' }}
      >
        <div className="modal-dialog modal-dialog-custom">
          <div className="login_box justify-content-center">
            <div className="login_leftimg">
              <img src="/assets/CF02FCB1-login_banner.jpg" alt="" loading="lazy" />
            </div>
            <div className="login_leftimg_mob">
              <img src="/assets/8C69B9E3-banner_mobile.webp" alt="" loading="lazy" />
            </div>
            <div className="login-div signup_div d-flex align-items-center flex-column justify-content-center position-relative satbet-form-busy-wrap">
              {loading ? (
                <div className="satbet-form-busy-overlay">
                  <div className="satbet-form-busy-spinner" />
                  <span className="satbet-form-busy-label">Creating account…</span>
                </div>
              ) : null}
              <div className="close close-login position-absolute" onClick={onClose} data-dismiss="modal" aria-label="Close">
                <img src="/assets/59CE17CE-close_btn.svg" alt="icons" loading="lazy" />
              </div>

              <div className="login_logo">
                <img src="/assets/FC100E65-Satbet-logo.png" width={150} height={48} alt="logo" loading="lazy" />
              </div>

              <div className="satbet-container">
                <div className="satbet-tabs d-flex justify-content-center">
                  <div className="satbet-tab satbet-tab-active text-center" id="login-tab">Signup</div>
                </div>

                <div className="signup_topbutton_group text-center">
                  <p>Now Create an Account</p>
                  <div className="button_group">
                    <button type="button" onClick={() => (window.location.href = 'https://linkli.in/suprt')}>
                      <img src="/assets/A857F476-suwa.png" alt="icons" loading="lazy" />
                      For Whatsapp ID
                    </button>
                  </div>
                </div>

                <form
                  className="form"
                  id="registerForm"
                  autoComplete="off"
                  method="post"
                  noValidate
                  onSubmit={(e) => { e.preventDefault(); handleSignup(); }}
                >
                  <input type="hidden" name="campaign_code" id="campaign_code" value="" />
                  <input type="hidden" name="rafUserId" id="rafUserId" value="" />
                  <input type="hidden" name="rafcampaign_code" id="rafcampaign_code" value="" />
                  <input type="hidden" name="affiliate_tagcode" id="affiliate_tagcode" value="" />
                  <input type="hidden" name="offer_id" id="offer_id" value="" />
                  <input type="hidden" name="clickid" id="clickid" value="" />
                  <input type="hidden" name="csrf_token" value="" />

                  <div className="row">
                    {/* Username */}
                    <div className="col-12">
                      <div className="form_group">
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <img src="/assets/766F716B-loginusericon.png" alt="icons" loading="lazy" />
                          </span>
                          <div className="form-floating form-floating-custom">
                            <input
                              type="text"
                              className="form-control form-control-custom"
                              id="reg_username"
                              placeholder=""
                              minLength={APP_CONFIG.USERNAME_MINLENGTH}
                              maxLength={APP_CONFIG.USERNAME_MAXLENGTH}
                              name="username"
                              autoComplete="off"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                            <label htmlFor="floatingInputGroup1">Username</label>
                          </div>
                        </div>
                        <label id="reg_username-error" className="lebel-error error" htmlFor="reg_username">
                          {errors.username}
                        </label>
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-12">
                      <div className="form_group">
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <img src="/assets/CAE3D0C4-password_loginicon.png" alt="icons" loading="lazy" />
                          </span>
                          <div className="form-floating form-floating-custom">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              minLength={APP_CONFIG.USERPASSWORD_MINLENGTH}
                              maxLength={APP_CONFIG.USERPASSWORD_MAXLENGTH}
                              id="reg_password"
                              className="form-control form-control-custom"
                              autoComplete="off"
                              placeholder=""
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="floatingInputGroup1">Password</label>
                            <img
                              src="/assets/53792E26-password_eye_close.png"
                              className="position-absolute password_eye"
                              alt="show password"
                              loading="lazy"
                              onClick={() => setShowPassword((v) => !v)}
                              style={{ cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                        <label id="reg_password-error" className="lebel-error error" htmlFor="reg_password">
                          {errors.password}
                        </label>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-12">
                      <div className="form_group">
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <img src="/assets/CAE3D0C4-password_loginicon.png" alt="icons" loading="lazy" />
                          </span>
                          <div className="form-floating form-floating-custom">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="c_password"
                              id="c_password"
                              minLength={APP_CONFIG.USERPASSWORD_MINLENGTH}
                              maxLength={APP_CONFIG.USERPASSWORD_MAXLENGTH}
                              className="form-control form-control-custom"
                              autoComplete="off"
                              placeholder=""
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <label htmlFor="floatingInputGroup1">Confirm Password</label>
                            <img
                              src="/assets/53792E26-password_eye_close.png"
                              className="position-absolute password_eye"
                              alt="show password"
                              loading="lazy"
                              onClick={() => setShowConfirmPassword((v) => !v)}
                              style={{ cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                        <label id="c_password-error" className="lebel-error error" htmlFor="c_password">
                          {errors.c_password}
                        </label>
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="row position-relative mobile_field_align">
                      <div className="col-4">
                        <div className="dropdown country-flag-code-dropdown">
                          <button
                            className="btn country-flag-code-btn dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                          >
                            <div className="phone-code phone-flag-code">
                              <img src="/assets/FF9CB102-india-flag.png" className="flag-img" alt="" width={20} height={14} loading="lazy" />
                              <span id="selectedCountryCode">+91</span>
                            </div>
                          </button>
                          <input type="hidden" id="country_code" name="country_code" value="+91" />
                        </div>
                      </div>
                      <div className="col-8 mobile_field_align">
                        <div className="input-group mb-3">
                          <div className="form-floating form-floating-custom form-floating-custom-mob-no">
                            <input
                              type="text"
                              name="mobile_no"
                              id="mobile_no"
                              className="form-control number_only"
                              autoComplete="off"
                              minLength={10}
                              maxLength={10}
                              placeholder=""
                              value={mobileNo}
                              onChange={(e) => handleMobileInput(e.target.value)}
                            />
                            <label htmlFor="floatingInputGroup1" className="mobno_field">Mobile Number</label>
                            <button
                              id="sendotp"
                              className="sendotp"
                              type="button"
                              onClick={handleSendOtp}
                              disabled={otpVerified || !username.trim() || mobileNo.length !== 10}
                            >
                              Send OTP
                            </button>
                          </div>
                        </div>
                      </div>
                      <label id="mobile_no-error" className="lebel-error error error_mob" htmlFor="mobile_no">
                        {errors.mobile_no}
                      </label>
                      <label id="otp_response-error" className="lebel-error error error_mob" htmlFor="otp_response">
                        {errors.otp_response}
                      </label>
                    </div>

                    {/* OTP */}
                    <div className="row position-relative mobile_field_align" id="otp_div">
                      <div className="col-12 mobile_field_align">
                        <div className="input-group mb-3">
                          <div className="form-floating form-floating-custom form-floating-custom-mob-no">
                            <input
                              type="text"
                              name="input_otp"
                              id="input_otp"
                              className="form-control number_only"
                              autoComplete="off"
                              placeholder=""
                              maxLength={6}
                              disabled={!otpSent || otpVerified}
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            />
                            <label htmlFor="floatingInputGroup1" className="mobno_field">Enter OTP</label>

                            <button
                              id="verify_otp"
                              type="button"
                              className="otpVerification"
                              onClick={handleVerifyOtp}
                              style={{ display: otpSent && !otpVerified ? 'block' : 'none' }}
                            >
                              Verify
                            </button>

                            <div className="timer_otp" id="timer_otp" style={{ alignItems: 'center', gap: '8px', display: timerActive ? 'flex' : 'none' }}>
                              <img src="/assets/781A4111-timer.png" alt="timer" />
                              <p id="timer">{formatTimer()}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <label id="input_otp-error" className="lebel-error error error_mob" htmlFor="input_otp">
                        {errors.input_otp}
                      </label>
                      <label id="otp_response-error" className="lebel-error" htmlFor="otp_response">
                        {errors.otp_response}
                      </label>
                    </div>

                    {/* Terms */}
                    <div className="row position-relative mobile_field_align text-center">
                      <div className="satbet-login-help text-center">
                        <label className="unique-switch unique-switch-signup">
                          <input
                            type="checkbox"
                            id="terms"
                            name="terms"
                            checked={terms}
                            onChange={(e) => setTerms(e.target.checked)}
                          />
                          <span className="unique-slider round"></span>
                        </label>
                        {' '}I agree to{' '}
                        <a className="need-help" href="/terms-and-conditions">Terms &amp; Conditions</a>
                      </div>
                      <label id="terms-error" className="lebel-error error error-toggle position-relative" htmlFor="terms">
                        {errors.terms}
                      </label>
                    </div>

                    {/* Submit */}
                    <div className="col-12 form_mob_align">
                      <button
                        type="button"
                        className="login-btn"
                        id="signup_btn"
                        onClick={handleSignup}
                        disabled={loading}
                      >
                        <span>{loading ? 'Please wait…' : 'Register'}</span>
                      </button>
                    </div>
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
