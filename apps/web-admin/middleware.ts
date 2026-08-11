import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for our custom isLoggedIn cookie
  const isLoggedIn = request.cookies.get('isLoggedIn');

  // If we are navigating to any protected route (not login)
  if (!request.nextUrl.pathname.startsWith('/login') && !isLoggedIn) {
    // Redirect instantly to the login page on the server side
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If they are logged in and trying to access /login, redirect to dashboard
  if (request.nextUrl.pathname.startsWith('/login') && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply this middleware to all pages except api, static files, images, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)'],
};
