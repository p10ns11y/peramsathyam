import type { LoaderFunction, MetaFunction } from 'remix';
import { useLoaderData } from 'remix';

import type { Poem } from '~/content';
import { poems } from '~/content';
import Record from '~/components/record';

export const meta: MetaFunction = ({ data }: { data: Poem | null }) => {
  if (!data) {
    return {
      title: 'கவிதை இல்லை',
      description: 'கவிதை இன்னும் அந்தத் தலைப்பில் எழுதப்படவில்லை',
    };
  }

  return {
    title: data.title,
    description: data.poem.slice(0, 100),
  };
};

export const loader: LoaderFunction = ({ params }) => {
  return poems.find((poem) => poem.slug === params.poemId) || null;
};

export default function Poem() {
  const data = useLoaderData<Poem | null>();

  if (!data) {
    return (
      <pre>
        <code>இன்னும் எழுதப்படவில்லை!</code>
      </pre>
    );
  }

  return (
    <main className="mx-[5vw] flex flex-col justify-center items-center md:items-start lg:items-start gap-4">
      <h1 className="text-[coral] text-3xl">{data.title}</h1>
      <pre className="text-[12px] md:text-lg lg:text-lg">
        <code>{data.poem}</code>
      </pre>
      <h4 className="text-[blueviolet]">{data.date} அன்று எழுதப்பட்டது</h4>
      {data.audioURL ? (
        <audio className="w-[250px]" src={data.audioURL} controls />
      ) : null}
      <Record audioFileName={data.slug} />
    </main>
  );
}
