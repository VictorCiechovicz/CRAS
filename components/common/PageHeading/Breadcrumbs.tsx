import Link from 'next/link';

export type PathProps = {
  name: string;
  href: string;
  onClick?: (event: React.MouseEvent) => void;
};

interface BreadcrumbsProps {
  paths: PathProps[];
}

export function Breadcrumbs({ paths }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb" className="mt-2">
      <ol className="flex leading-none text-gray-400 font-medium">
        {paths.map((path, index) =>
          index < paths.length - 1 ? (
            <li key={index}>
              <Link href={path.href} onClick={path.onClick}>
                {path.name}
                <span className="px-2">{'>'}</span>
              </Link>
            </li>
          ) : (
            <li key={index} className="text-gray-900">
              {path.name}
            </li>
          )
        )}
      </ol>
    </nav>
  );
}
