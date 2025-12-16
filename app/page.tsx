import { headers } from 'next/headers';
import { fetchPage } from '@/lib/drupalClient';
import DynamicComponent from '@/components/DynamicComponent';
import Breadcrumbs from '@/components/Breadcrumbs';
import Message from '@/components/Message';

export default async function Home() {
  // Fetch Drupal front page
  let pageData;
  try {
    const headersList = await headers();
    pageData = await fetchPage('/', headersList);
  } catch (error: any) {
    console.error('Failed to fetch home page:', error);
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-2">
          {error.message || 'Failed to load the home page from Drupal.'}
        </p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">No Content</h1>
        <p className="mt-2">No home page content found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!Array.isArray(pageData.messages) && pageData.messages && (
        <Message messages={pageData.messages} />
      )}

      {pageData.breadcrumbs && (
        <Breadcrumbs breadcrumbs={pageData.breadcrumbs} />
      )}

      {pageData.title && (
        <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
          {pageData.title}
        </h1>
      )}

      {pageData.content && (
        <div className="prose prose-lg max-w-none">
          <DynamicComponent
            element={pageData.content.element}
            content={pageData.content}
          />
        </div>
      )}
    </div>
  );
}
