import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { fetchPageForAppRouter } from '@/lib/drupalClient';
import DynamicComponent from '@/components/DynamicComponent';
import Breadcrumbs from '@/components/Breadcrumbs';
import Message from '@/components/Message';

type PageProps = {
  params: Promise<{ alias: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DrupalPage({ params }: PageProps) {
  const { alias } = await params;
  const path = `/${alias.join('/')}`;

  let pageData;
  try {
    const headersList = await headers();
    // fetchPageForAppRouter handles cookie forwarding and redirects automatically
    pageData = await fetchPageForAppRouter(path, headersList);
  } catch (error: any) {
    console.error('Failed to fetch page:', error);

    // Handle 404 errors
    if (error.statusCode === 404) {
      notFound();
    }

    // For other errors, render error message
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-2">
          {error.message || 'An error occurred while loading the page.'}
        </p>
      </div>
    );
  }

  if (!pageData) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!Array.isArray(pageData.messages) && pageData.messages && (
        <Message messages={pageData.messages} />
      )}

      {pageData.breadcrumbs && (
        <Breadcrumbs breadcrumbs={pageData.breadcrumbs} />
      )}

      <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
        {pageData.title}
      </h1>

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

// Generate metadata from Drupal page data
export async function generateMetadata({ params }: PageProps) {
  const { alias } = await params;
  const path = `/${alias.join('/')}`;

  try {
    const headersList = await headers();
    const pageData = await fetchPageForAppRouter(path, headersList);

    const titleMeta = pageData.metatags?.meta.find(
      (meta) => meta.name === 'title'
    );
    const descriptionMeta = pageData.metatags?.meta.find(
      (meta) => meta.name === 'description'
    );

    return {
      title: titleMeta?.content || pageData.title,
      description: descriptionMeta?.content,
    };
  } catch (error) {
    return {
      title: 'Page Not Found',
    };
  }
}
