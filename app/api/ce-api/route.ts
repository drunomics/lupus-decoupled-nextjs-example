import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock CE-API endpoint - Home page
 * Only active when ENABLE_MOCK_API environment variable is set
 */
export async function GET(request: NextRequest) {
  // Only serve mock data when explicitly enabled
  if (!process.env.ENABLE_MOCK_API) {
    return new NextResponse(null, { status: 404 });
  }

  // Dynamic import to avoid bundling mock data in production
  const { handleHomePage } = await import('@/mocks/ce-api/handlers');
  return handleHomePage();
}
