import type { LoaderFunction } from 'remix';
import { useLoaderData, Link } from 'remix';

import type { Poems } from '~/content';
import { poems } from '~/content';

export const loader: LoaderFunction = () => {
  return poems as Poems;
};

export default function PoemsIndex() {
  const poems = useLoaderData<Poems>();

  return (
    <ul className="mx-[5vw] grid grid-cols-3 gap-4">
      {poems.map((poem) => (
        <li
          key={poem.title}
          className="w-min h-auto bg-white dark:bg-gray-800 dark:text-white shadow-2xl rounded-lg p-8"
        >
          <Link prefetch="intent" to={poem.slug}>
            {poem.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
