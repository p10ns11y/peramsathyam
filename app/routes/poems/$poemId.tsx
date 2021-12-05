import type { LoaderFunction } from 'remix';
import { useLoaderData, Link } from 'remix';

import type { Poem } from '~/content';
import { poems } from '~/content';

export const loader: LoaderFunction = ({ params }) => {
  return poems.find((poem) => poem.slug === params.poemId);
};

export default function Poem() {
  const data = useLoaderData<Poem>();

  if (!data) {
    return (
      <pre>
        <code>இன்னும் எழுதப்படவில்லை!</code>
      </pre>
    );
  }

  return (
    <>
      <h1 style={{ color: 'coral' }}>{data.title}</h1>
      <pre style={{ fontSize: '1rem' }}>
        <code>{data.poem}</code>
      </pre>
      <h4 style={{ color: 'blueviolet' }}>{data.date} அன்று எழுதப்பட்டது</h4>
    </>
  );
}
