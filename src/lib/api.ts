import { APP_CONFIG } from '@/config/constants';
import type { LoginResponse, RegisterResponse } from '@/types';

const BASE = APP_CONFIG.BASE_URL;

export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  const body = new URLSearchParams({ username, password });
  const res = await fetch(`${BASE}user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

export async function registerUser(data: Record<string, string>): Promise<RegisterResponse> {
  const body = new URLSearchParams(data);
  const res = await fetch(`${BASE}user/register/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

export async function checkUsernameExists(username: string): Promise<{ value: string }> {
  const body = new URLSearchParams({ username });
  const res = await fetch(`${BASE}user/register/check_username_exists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  return res.json();
}

export async function checkMobileExists(mobileNo: string, countryCode: string): Promise<{ value: string }> {
  const body = new URLSearchParams({ mobile_no: countryCode + mobileNo });
  const res = await fetch(`${BASE}user/register/check_usermobileno_exist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  return res.json();
}

export async function sendMobileOtp(mobileCode: string, mobileNo: string, username: string): Promise<{ response: number }> {
  const body = new URLSearchParams({ mobileCode, mobileNo, username });
  const res = await fetch(`${BASE}user/register/send_mobileno_otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  return res.json();
}

export async function verifyMobileOtp(OtpNo: string, mobileCode: string, mobileNo: string): Promise<{ response: number }> {
  const body = new URLSearchParams({ OtpNo, mobileCode, mobileNo });
  const res = await fetch(`${BASE}user/register/verify_mobileno_otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  return res.json();
}

// Fetch carousel images from backend
export async function fetchCarouselImages(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE}api/carousel-images`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// Fetch user balance
export async function fetchUserBalance(userId: string): Promise<number> {
  try {
    const res = await fetch(`${BASE}api/user/balance?userId=${userId}`);
    if (!res.ok) return 0;
    const data = await res.json();
    return data.balance || 0;
  } catch {
    return 0;
  }
}
