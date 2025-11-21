import { NextRequest, NextResponse } from 'next/server';

// Drupal menu item structure (raw format from Drupal API)
type DrupalMenuItem = {
  key: string;
  title: string;
  description: string | null;
  uri: string;
  alias: string;
  external: boolean;
  absolute: string;
  relative: string;
  existing: boolean;
  weight: string;
  expanded: boolean;
  enabled: boolean;
  uuid: string | null;
  options: any[];
  children?: DrupalMenuItem[];
}

/**
 * Mock Drupal CE-API endpoint - All routes
 * This route mimics the Drupal custom elements API for pages and menus
 */

// Mock menu data
const mockMenus: Record<string, DrupalMenuItem[]> = {
  main: [
    {
      key: 'standard.front_page',
      title: 'Home',
      description: '',
      uri: '',
      alias: '',
      external: false,
      absolute: 'http://localhost:3000/',
      relative: '/',
      existing: true,
      weight: '0',
      expanded: false,
      enabled: true,
      uuid: null,
      options: []
    },
    {
      key: 'node-1-menu-item',
      title: 'Page 1',
      description: null,
      uri: 'node/1',
      alias: 'node/1',
      external: false,
      absolute: 'http://localhost:3000/node/1',
      relative: '/node/1',
      existing: true,
      weight: '1',
      expanded: false,
      enabled: true,
      uuid: 'aa9f3167-a1b0-4f5b-b088-33cf753a9331',
      options: []
    },
    {
      key: 'node-2-menu-item',
      title: 'Page 2',
      description: null,
      uri: 'node/2',
      alias: 'node/2',
      external: false,
      absolute: 'http://localhost:3000/node/2',
      relative: '/node/2',
      existing: true,
      weight: '2',
      expanded: false,
      enabled: true,
      uuid: 'c7b2e697-e61c-4787-870f-4d3622355382',
      options: []
    },
    {
      key: 'node-3-menu-item',
      title: 'Page 3',
      description: null,
      uri: 'node/3',
      alias: 'node/3',
      external: false,
      absolute: 'http://localhost:3000/node/3',
      relative: '/node/3',
      existing: true,
      weight: '3',
      expanded: false,
      enabled: true,
      uuid: 'd8a3f789-b2c1-4d56-9012-45ef67890abc',
      options: []
    }
  ]
};

// Mock page data
const mockPages: Record<string, any> = {
  'node/1': {
    title: 'Page 1',
    messages: [],
    breadcrumbs: [
      { frontpage: true, url: '/', label: 'Home' }
    ],
    metatags: {
      meta: [
        { name: 'title', content: 'Page 1 | Lupus Decoupled' },
        { name: 'description', content: 'This is the first example page' }
      ],
      link: [
        { rel: 'canonical', href: 'http://localhost:3000/node/1' }
      ]
    },
    content: {
      element: 'node--default',
      title: 'Page 1',
      body: '<p>Welcome to Page 1. This is an example of a simple Drupal page rendered in Next.js.</p><p>The content you see here is fetched from the mock API and demonstrates cookie forwarding, header pass-through, and component rendering.</p>'
    }
  },
  'node/2': {
    title: 'Page 2',
    messages: [],
    breadcrumbs: [
      { frontpage: true, url: '/', label: 'Home' }
    ],
    metatags: {
      meta: [
        { name: 'title', content: 'Page 2 | Lupus Decoupled' },
        { name: 'description', content: 'This is the second example page' }
      ],
      link: [
        { rel: 'canonical', href: 'http://localhost:3000/node/2' }
      ]
    },
    content: {
      element: 'node--default',
      title: 'Page 2',
      body: '<p>This is Page 2, demonstrating how different pages are rendered using the same component system.</p><p>Each page can have its own content, metadata, and structure while maintaining a consistent look and feel.</p>'
    }
  },
  'node/3': {
    title: 'Page 3',
    messages: [],
    breadcrumbs: [
      { frontpage: true, url: '/', label: 'Home' }
    ],
    metatags: {
      meta: [
        { name: 'title', content: 'Page 3 | Lupus Decoupled' },
        { name: 'description', content: 'This is the third example page' }
      ],
      link: [
        { rel: 'canonical', href: 'http://localhost:3000/node/3' }
      ]
    },
    content: {
      element: 'node--default',
      title: 'Page 3',
      body: '<p>This is Page 3, demonstrating how different pages are rendered using the same component system.</p><p>Each page can have its own content, metadata, and structure while maintaining a consistent look and feel.</p>'
    }
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join('/');

  // Handle menu API requests
  if (pathString.startsWith('api/menu_items/')) {
    const menuName = pathString.replace('api/menu_items/', '');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));

    const menu = mockMenus[menuName];

    if (menu) {
      return NextResponse.json(menu, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
          'X-Drupal-Cache': 'MOCK',
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

  // Handle page content requests
  const mockPage = mockPages[pathString];

  if (mockPage) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json(mockPage, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
        'X-Drupal-Cache': 'MOCK',
      }
    });
  }

  // Return 404 for unknown routes
  return NextResponse.json(
    {
      title: 'Page not found',
      messages: {
        error: ['The requested page could not be found.']
      },
      content: {
        element: 'node--default',
        title: 'Page not found',
        body: '<p>The page you are looking for does not exist.</p>'
      },
      statusCode: 404
    },
    { status: 404 }
  );
}
