// @/proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { authorizeRequest } from "@/auth.config";



/**
 * === Proxy Middleware ===
 *
 * Handles authentication and route protection for all incoming requests.
 * 
 * - Fetches current user session.
 * - Checks if the request requires authentication.
 * - Redirects unauthorized users to `/sign-in`.
 * - Allows authorized requests to continue.
 */
export default async function proxy(request: NextRequest) {


  /**
   * === Fetch User Session ===
   *
   * - Uses the `auth` utility to get the current session.
   * - Session can be `null` if user is not authenticated.
   */
  const session = await auth();


  /**
   * === Route Authorization ===
   *
   * - Checks if the request is for a protected route.
   * - Redirects if user is not logged in.
   */
  const response = authorizeRequest(request, session);
  if (response) {
    return response;
  }

  /**
   * === Allow Request ===
   *
   * - User is authorized or route is public.
   * - Continues request without modification.
   */
  return NextResponse.next();
}

/**
 * === Middleware Configuration ===
 *
 * - `matcher` defines which paths the middleware applies to.
 * - Excludes static assets, Next.js internals, and common files.
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};