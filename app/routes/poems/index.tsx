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
    <ul className="mx-[5vw] grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-4">
      {poems.map((poem) => (
        <li
          key={poem.title}
          className="p-4 h-auto dark:bg-gray-800 shadow-md hover:shadow-2xl rounded-lg break-words"
        >
          <Link prefetch="intent" to={poem.slug}>
            <h2 className="font-bold text-lg">{poem.title}</h2>
          </Link>
        </li>
      ))}
    </ul>
  );
}
