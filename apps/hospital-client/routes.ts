/**
 * The default redirect path after logging in
 * @type {string}
 */

export const DEFAULT_LOGGEDIN_REDIRECT = "/console/dashboard";

/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */

export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * An array of routes that are used for authentication.
 * These routes will redired logged in udrs to /setting.
 * @type {string[]}
 */

export const authRoutes = ["/auth/login", "/auth/error", "/auth/reset", "/auth/new-password"];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";
