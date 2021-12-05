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
    <ul>
      {poems.map((poem) => (
        <li key={poem.title}>
          <Link prefetch="intent" to={poem.slug}>
            {poem.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
