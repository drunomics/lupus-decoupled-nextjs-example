import Link from 'next/link';
import { MenuItem } from '@/lib/drupalClient';

type MenuProps = {
  items: MenuItem[];
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
  depth?: number;
  maxDepth?: number;
};

export default function Menu({
  items,
  className = '',
  itemClassName = '',
  activeClassName = 'font-bold',
  depth = 0,
  maxDepth = 3
}: MenuProps) {
  // Ensure items is always an array
  const menuItems = Array.isArray(items) ? items : [];

  if (menuItems.length === 0) {
    return null;
  }

  const hasChildren = (item: MenuItem) => item.children && item.children.length > 0;

  return (
    <ul className={className} role={depth === 0 ? 'navigation' : undefined}>
      {menuItems.map((item, index) => {
        // Handle missing URL - use '#' as fallback or skip item
        const url = item.url || '#';
        const title = item.title || 'Untitled';

        return (
          <li key={`${url}-${index}`} className={itemClassName}>
            <Link
              href={url}
              className="font-medium transition-colors hover:text-blue-600"
            >
              {title}
            </Link>

            {hasChildren(item) && depth < maxDepth && (
              <Menu
                items={item.children!}
                className={`ml-4 mt-2 ${className}`}
                itemClassName={itemClassName}
                activeClassName={activeClassName}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
