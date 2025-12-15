/**
 * Mock handlers for CE-API endpoints
 * These handlers are only used during development when ENABLE_MOCK_API is set
 */
import { NextResponse } from 'next/server';
import { mockMenus, mockPages, notFoundResponse } from './data';

const MOCK_HEADERS = {
  'Content-Type': 'application/json',
  'X-Drupal-Cache': 'MOCK',
};

/**
 * Handle home page request
 */
export async function handleHomePage(): Promise<NextResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return NextResponse.json(mockPages[''], {
    status: 200,
    headers: {
      ...MOCK_HEADERS,
      'Cache-Control': 'public, max-age=60',
    }
  });
}

/**
 * Handle menu API request
 */
export async function handleMenuRequest(menuName: string): Promise<NextResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));

  const menu = mockMenus[menuName];

  if (menu) {
    return NextResponse.json(menu, {
      status: 200,
      headers: {
        ...MOCK_HEADERS,
        'Cache-Control': 'public, max-age=300',
      }
    });
  }

  // Return empty menu for unknown menu names
  return NextResponse.json([], {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

/**
 * Handle page content request
 */
export async function handlePageRequest(pathString: string): Promise<NextResponse> {
  const mockPage = mockPages[pathString];

  if (mockPage) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json(mockPage, {
      status: 200,
      headers: {
        ...MOCK_HEADERS,
        'Cache-Control': 'public, max-age=60',
      }
    });
  }

  // Return 404 for unknown routes
  return NextResponse.json(notFoundResponse, { status: 404 });
}

/**
 * Handle any CE-API path request
 */
export async function handleCeApiPath(path: string[]): Promise<NextResponse> {
  const pathString = path.join('/');

  // Handle menu API requests
  if (pathString.startsWith('api/menu_items/')) {
    const menuName = pathString.replace('api/menu_items/', '');
    return handleMenuRequest(menuName);
  }

  // Handle page content requests
  return handlePageRequest(pathString);
}
