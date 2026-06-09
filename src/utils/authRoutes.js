/**
 * Central auth routing for Fixrly.
 *
 * Flow:
 * - Public pages: browse without login (home, services, providers, static pages, become-provider).
 * - Private pages: require login; unauthenticated users go to /login?redirect=<intended-path>.
 * - After login/register: return to redirect path, or /profile (account) by default.
 * - Persisted session: Redux + localStorage keeps users signed in until logout or 401.
 */

export const AUTH_LOGIN_PATH = "/login";
export const AUTH_ACCOUNT_PATH = "/profile";

/** Routes that require an authenticated session (Pages Router pathname patterns). */
export const PRIVATE_ROUTES = [
  "/cart",
  "/chats",
  "/checkout",
  "/general-bookings",
  "/requested-bookings",
  "/bookmarks",
  "/my-services-requests",
  "/my-service-request-details/[...slug]",
  "/addresses",
  "/notifications",
  "/payment-status",
  "/payment-history",
  "/booking/[...slug]",
  "/profile",
  "/search/[slug]",
];

export const isPrivateRoute = (pathname = "") =>
  PRIVATE_ROUTES.includes(pathname);

/** Prevent open redirects; only allow same-site relative paths. */
export const getSafeRedirectPath = (path, fallback = AUTH_ACCOUNT_PATH) => {
  if (!path || typeof path !== "string") return fallback;

  let decoded = path;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    return fallback;
  }

  if (!decoded.startsWith("/") || decoded.startsWith("//")) return fallback;
  if (decoded.startsWith(AUTH_LOGIN_PATH)) return fallback;

  return decoded;
};

/** Build login URL with optional return path after auth. */
export const getLoginUrl = (returnPath = AUTH_ACCOUNT_PATH) => {
  const safeReturn = getSafeRedirectPath(returnPath, AUTH_ACCOUNT_PATH);
  if (safeReturn === AUTH_ACCOUNT_PATH && !returnPath) {
    return AUTH_LOGIN_PATH;
  }
  return `${AUTH_LOGIN_PATH}?redirect=${encodeURIComponent(safeReturn)}`;
};

/** Resolve href for nav links: account when logged in, login with redirect when not. */
export const getAuthAwareHref = (targetPath, isLoggedIn) => {
  const safeTarget = getSafeRedirectPath(targetPath, targetPath || AUTH_ACCOUNT_PATH);
  if (isLoggedIn) return safeTarget;
  if (isPrivateRoute(safeTarget.split("?")[0])) {
    return getLoginUrl(safeTarget);
  }
  return getLoginUrl(safeTarget);
};
