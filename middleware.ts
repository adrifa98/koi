import { routing } from '@/i18n/routing';
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = url.hostname;

  if (hostname !== 'movistar-koi.vercel.app') {
    return NextResponse.redirect(`https://movistar-koi.vercel.app${url.pathname}${url.search}`);
  }

  const intlResponse = intlMiddleware(request);
  return intlResponse || NextResponse.next();
}

export const config = {
  matcher: ['/', '/(es|en)/:path*'],
};
 