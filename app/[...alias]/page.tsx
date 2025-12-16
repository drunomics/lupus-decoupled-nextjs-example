import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { fetchPage } from '@/lib/drupalClient';
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
    // fetchPage handles cookie forwarding and redirects automatically
    pageData = await fetchPage(path, headersList);
  } catch (error: any) {
    if (error.statusCode === 404) {
      notFound();
    }
    throw error;
  }

  if (!pageData) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      {pageData.metatags?.jsonld && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(pageData.metatags.jsonld).replace(/</g, '\\u003c'),
          }}
        />
      )}

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
    const pageData = await fetchPage(path, headersList);

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
