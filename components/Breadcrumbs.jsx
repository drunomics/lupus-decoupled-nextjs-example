import Link from "next/link";

export default function Breadcrumbs({ breadcrumbs }) {
    if (!breadcrumbs || breadcrumbs.length === 0) {
        return null
    }

    return (
        <nav aria-label="breadcrumb" className="mb-6">
            <ol className="flex list-none space-x-2 text-sm">
                {breadcrumbs.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <Link
                            href={item.url}
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                            {item.label}
                        </Link>
                        {index < breadcrumbs.length - 1 && (
                            <span className="mx-2 text-gray-400">/</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}