/**
 * Generate a random password matching Satbet password rules
 * Used for one-click signup (mirrors CI custom.js generatePassword)
 */
export function generatePassword(): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const special = '@';
  const numbers = '0123456789';

  let pass = '';
  pass += upper[Math.floor(Math.random() * upper.length)];
  pass += special[Math.floor(Math.random() * special.length)];
  pass += lower[Math.floor(Math.random() * lower.length)];
  pass += numbers[Math.floor(Math.random() * numbers.length)];
  for (let i = 0; i < 4; i++) {
    const charset = Math.random() < 0.5 ? lower : numbers;
    pass += charset[Math.floor(Math.random() * charset.length)];
  }
  return pass.split('').sort(() => 0.5 - Math.random()).join('');
}

/**
 * Set cookie helper (mirrors CI setCookie function)
 */
export function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}
