import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run on trial pages to optimize performance
  if (pathname.startsWith('/trials/')) {
    // If there's any uppercase character in the pathname
    if (/[A-Z]/.test(pathname)) {
      const lowercaseUrl = request.nextUrl.clone();
      lowercaseUrl.pathname = pathname.toLowerCase();
      // 301 Permanent Redirect for SEO conservation
      return NextResponse.redirect(lowercaseUrl, 301);
    }
  }

  return NextResponse.next();
}

// Ensure middleware only runs on relevant paths
export const config = {
  matcher: ['/trials/:path*'],
};
