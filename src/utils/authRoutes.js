/**
 * Central auth & navigation rules for Fixrly.
 *
 * - Default app entry → /services
 * - Landing (/home) → optional location picker (not the default)
 * - Logged-in account → /profile
 * - Protected routes → /login?redirect=… (or /register?redirect=…)
 */

export const AUTH_ACCOUNT_PATH = "/profile";
export const AUTH_LOGIN_PATH = "/login";
export const AUTH_REGISTER_PATH = "/register";
export const LANDING_PATH = "/home";
/** Primary entry when opening the app or tapping Home */
export const DEFAULT_APP_PATH = "/services";

export const PRIVATE_ROUTE_PATTERNS = [
  "/cart",
  "/chats",
  "/checkout",
  "/general-bookings",
  "/requested-bookings",
  "/bookmarks",
  "/my-services-requests",
  "/my-service-request-details",
  "/addresses",
  "/notifications",
  "/payment-status",
  "/payment-history",
  "/booking",
  "/profile",
];

const AUTH_ONLY_PATHS = new Set([
  AUTH_LOGIN_PATH,
  AUTH_REGISTER_PATH,
  LANDING_PATH,
  AUTH_ACCOUNT_PATH,
  DEFAULT_APP_PATH,
]);

const ALWAYS_PUBLIC_PREFIXES = [
  "/about-us",
  "/contact-us",
  "/terms-and-conditions",
  "/privacy-policy",
  "/faqs",
  "/blogs",
  "/sitemap",
  "/become-provider",
  "/blog-details",
  "/login",
  "/register",
  "/home",
];

/**
 * Routes that need lat/lng before content can load.
 */
export const LOCATION_REQUIRED_ROUTE_PATTERNS = [
  "/providers",
  "/provider-details",
  "/search",
  "/service",
];

export function normalizePath(path = "") {
  if (!path || path === "") return "/";
  const withoutQuery = String(path).split("?")[0].split("#")[0];
  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery || "/";
}

export function getSafeRedirectPath(redirect, fallback = AUTH_ACCOUNT_PATH) {
  const raw =
    typeof redirect === "string"
      ? redirect
      : Array.isArray(redirect)
        ? redirect[0]
        : "";

  const path = normalizePath(raw);

  if (!path || path === AUTH_LOGIN_PATH || path === AUTH_REGISTER_PATH) {
    return fallback;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return fallback;
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function getLoginUrl(redirectPath = "") {
  const safe = getSafeRedirectPath(redirectPath, "");
  if (!safe) return AUTH_LOGIN_PATH;
  return `${AUTH_LOGIN_PATH}?redirect=${encodeURIComponent(safe)}`;
}

export function getRegisterUrl(redirectPath = "") {
  const loginUrl = getLoginUrl(redirectPath);
  const separator = loginUrl.includes("?") ? "&" : "?";
  return `${loginUrl}${separator}mode=register`;
}

export function isPrivateRoute(pathname) {
  const path = normalizePath(pathname);
  return PRIVATE_ROUTE_PATTERNS.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}

export function isLocationRequiredRoute(pathname) {
  const path = normalizePath(pathname);
  if (AUTH_ONLY_PATHS.has(path)) return false;
  return LOCATION_REQUIRED_ROUTE_PATTERNS.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}

export function isAlwaysPublicRoute(pathname) {
  const path = normalizePath(pathname);
  return ALWAYS_PUBLIC_PREFIXES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}

/**
 * Where the "Home" nav item should go (default app page).
 */
export function getHomeNavPath() {
  return DEFAULT_APP_PATH;
}

/**
 * Rewrite href for guests clicking protected destinations.
 */
export function getAuthAwareHref(href, isLoggedIn) {
  if (isLoggedIn || !href) return href;

  const path = normalizePath(href);
  if (isPrivateRoute(path)) {
    return getLoginUrl(href);
  }
  return href;
}
