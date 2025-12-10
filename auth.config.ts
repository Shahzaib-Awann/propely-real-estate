// @/auth.config.ts

import type { NextRequest } from 'next/server';
import type { Session } from 'next-auth';



/**
 * === Authentication Configuration for NextAuth ===
 * 
 * Defines custom sign-in page, authorization logic, and providers.
 */
export const authConfig = {
  pages: {
    signIn: '/sign-in', // <- Custom sign-in page
  },

  callbacks: {

    /**
     * Controls access to protected routes and redirect behavior.
     */
    authorized({ auth, request }: { auth: Session | null; request: NextRequest }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;

      // Routes that require authentication
      const protectedRoutes = ["/chats"];
      const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // Redirect unauthenticated users trying to access protected pages
      if (isProtected && !isLoggedIn) {
        const url = request.nextUrl.clone();
        url.pathname = "/sign-in";
        url.searchParams.set("callbackUrl", pathname);
        return Response.redirect(url);
      }

      // Logged in user visits sign-in or sign-up → redirect home
      const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
      if (isLoggedIn && isAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        url.search = "";
        return Response.redirect(url);
      }

      return true;
    },
  },
  
  providers: [],
};