// User types
export interface User {
  userid: string;
  username: string;
  registration_type: string | null;
  partner_id?: string;
  currency_code?: string;
}

export interface CarouselImage {
  target_url: string;
  desktop_image_url: string;
  mobile_image_url: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  balance: number;
  messageCount: number;
  tierValue: 0 | 1 | 2 | 3 | 4;
}

export interface LoginResponse {
  error: boolean;
  message?: string;
  redirect?: string;
  userid?: string;
}

export interface RegisterResponse {
  error: boolean;
  message?: string;
  url?: string;
  userId?: string;
  userName?: string;
}

export interface MetaData {
  page_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_og_title?: string;
  meta_og_description?: string;
  meta_og_site_name?: string;
  meta_og_type?: string;
  meta_og_img?: string;
}

export interface AppConfig {
  USERNAME_MINLENGTH: number;
  USERNAME_MAXLENGTH: number;
  USERPASSWORD_MINLENGTH: number;
  USERPASSWORD_MAXLENGTH: number;
  DEMO_USERNAME: string;
  DEMO_USER_PASSWORD: string;
  BASE_URL: string;
}
