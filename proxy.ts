import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // Skip API routes and static assets
  if (request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  try {
    const drupalBaseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;
    if (!drupalBaseUrl) {
      return response;
    }

    const ceApiEndpoint = '/ce-api';
    const path = request.nextUrl.pathname === '/' ? '/' : request.nextUrl.pathname.slice(1);

    // Make a HEAD request to Drupal to get cache headers
    // HEAD requests are lightweight as they don't return response body
    const drupalResponse = await fetch(`${drupalBaseUrl}${ceApiEndpoint}/${path}`, {
      method: 'HEAD',
      headers: {
        'cookie': request.headers.get('cookie') || '',
        'authorization': request.headers.get('authorization') || '',
        'accept-language': request.headers.get('accept-language') || '',
      },
    });

    // Forward cache-related headers from Drupal to client
    const headersToForward = [
      'cache-control',
      'x-drupal-cache',
      'x-drupal-dynamic-cache',
      'etag',
      'vary',
    ];

    headersToForward.forEach(header => {
      const value = drupalResponse.headers.get(header);
      if (value) {
        response.headers.set(header, value);
      }
    });
  } catch (error) {
    // If Drupal request fails, continue without cache headers
    console.error('Failed to fetch Drupal cache headers:', error);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
