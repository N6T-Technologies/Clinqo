import authConfig from "./auth.config";
import NextAuth from "next-auth";

import { DEFAULT_LOGGEDIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "./routes";

const { auth } = NextAuth(authConfig);

//@ts-ignore
export default auth((req) => {
    const { nextUrl } = req;

    const isLoggedIn = !!req.auth;

    const isApiAuthPrefix = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthPrefix) {
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGGEDIN_REDIRECT, nextUrl));
        }
        return null;
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth/login", nextUrl));
    }

    return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
