import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock CE-API endpoint - All routes
 * Only active when ENABLE_MOCK_API environment variable is set
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // Only serve mock data when explicitly enabled
  if (!process.env.ENABLE_MOCK_API) {
    return new NextResponse(null, { status: 404 });
  }

  const { path } = await params;

  // Dynamic import to avoid bundling mock data in production
  const { handleCeApiPath } = await import('@/mocks/ce-api/handlers');
  return handleCeApiPath(path);
}
