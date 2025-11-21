import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock Drupal CE-API endpoint - Home page
 * This route mimics the Drupal custom elements API for the homepage
 */
export async function GET(request: NextRequest) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return NextResponse.json({
    title: 'Welcome',
    messages: [],
    breadcrumbs: [],
    metatags: {
      meta: [
        { name: 'title', content: 'Home | Lupus Decoupled' },
        { name: 'description', content: 'Welcome to Lupus Decoupled Next.js Demo' }
      ],
      link: [
        { rel: 'canonical', href: 'http://localhost:3000/' }
      ]
    },
    content: {
      element: 'node--default',
      title: 'Welcome to Lupus Decoupled',
      body: '<p>This is the home page fetched from the mock Drupal API.</p><p>The frontend is making real HTTP requests to <code>/api/ce-api</code> which mimics a Drupal backend.</p>'
    }
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60',
      'X-Drupal-Cache': 'MOCK',
    }
  });
}
