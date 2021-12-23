import type { LoaderFunction } from 'remix';
import { useLoaderData, Link } from 'remix';

import type { Poems } from '~/content';
import { poems } from '~/content';

import * as mothalPorumKathalPorum from './mothal-porum-kathal-porum.mdx';
import * as theroduVeethi from './therodu-veethi.mdx';

type MdxModule = {
  filename: string;
  attributes: {
    meta: {
      title: string;
      description: string;
    };
  };
};

function getPoemFromModule(mdxModule: MdxModule) {
  return {
    slug: mdxModule.filename.replace(/\.mdx?$/, ''),
    poem: mdxModule.attributes.meta.description,
    ...mdxModule.attributes.meta,
  };
}

export const loader: LoaderFunction = () => {
  return [
    ...poems,
    getPoemFromModule(mothalPorumKathalPorum),
    getPoemFromModule(theroduVeethi),
  ] as Poems;
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
            <p className="pt-4 text-gray-700 dark:text-yellow-400">
              {poem.poem.substring(0, 50)}...
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
