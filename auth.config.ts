// @/auth.config.ts

import type { NextRequest } from "next/server";
import type { Session } from "next-auth";
import { NextResponse } from "next/server";

/**
 * === Request Authorization Utility ===
 *
 * Handles route protection logic based on user session state.
 * Redirects unauthenticated users attempting to access protected routes.
 */
export function authorizeRequest(
  request: NextRequest,
  session: Session | null
) {

  /**
   * === Extract Path & Session Info ===
   *
   * - `pathname`: Current request path.
   * - `isLoggedIn`: Boolean indicating whether user is authenticated.
   */
  const pathname = request.nextUrl.pathname;
  const isLoggedIn = !!session?.user;

  /**
   * === Protected Routes Configuration ===
   *
   * - Define routes that require user authentication.
   */
  const protectedRoutes = ["/chats", "/profile", "/property"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  /**
   * === Unauthorized Access Handling ===
   *
   * - If user is not logged in and route is protected:
   *   - Redirect to `/sign-in`.
   *   - Attach `callbackUrl` to continue after login.
   */
  if (isProtected && !isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  /**
   * === Allow Request ===
   *
   * - If no protection applies or user is authenticated,
   *   continue request without modification.
   */
  return null;
}