import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'huzaifa_admin_session';
const EXPECTED_SECRET = 'huzaifa_admin_authorized_token_2026';

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value === EXPECTED_SECRET;
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getSessionValue() {
  return EXPECTED_SECRET;
}
