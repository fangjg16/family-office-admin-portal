const SESSION_KEY = "jfo-admin-token";
const USERNAME_KEY = "jfo-admin-username";

export function loadAdminToken(): string | null {
  try {
    const t = sessionStorage.getItem(SESSION_KEY)?.trim();
    return t || null;
  } catch {
    return null;
  }
}

export function saveAdminSession(token: string, username: string): void {
  sessionStorage.setItem(SESSION_KEY, token);
  sessionStorage.setItem(USERNAME_KEY, username);
}

export function loadAdminUsername(): string | null {
  try {
    return sessionStorage.getItem(USERNAME_KEY);
  } catch {
    return null;
  }
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(USERNAME_KEY);
}
