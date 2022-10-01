import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import type { Poem } from '~/content';
import { poems } from '~/content';
import Recorder from '~/components/recorder';

export const meta: MetaFunction = ({ data }: { data: Poem | null }) => {
  if (!data) {
    return {
      title: 'கவிதை இல்லை',
      description: 'கவிதை இன்னும் அந்தத் தலைப்பில் எழுதப்படவில்லை',
      'twitter:title': 'கவிதை இல்லை',
      'twitter:description': 'கவிதை இன்னும் அந்தத் தலைப்பில் எழுதப்படவில்லை',
    };
  }

  return {
    title: data.title,
    description: data.poem.slice(0, 100),
    'twitter:title': data.title,
    'twitter:description': data.poem.slice(0, 100),
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
      <h1 className="text-[goldenrod] font-extrabold dark:poem-title-shadow text-3xl">
        {data.title}
      </h1>
      <pre className="text-[12px] md:text-lg lg:text-lg">
        <code>{data.poem}</code>
      </pre>
      <h4 className="text-[blueviolet]">{data.date} அன்று எழுதப்பட்டது</h4>
      {data.audioURL || data.mp3AudioURL ? (
        <audio className="w-[250px]" controls>
          <source src={data.audioURL} type="audio/webm" />
          <source src={data.mp3AudioURL} type="audio/mp3" />
          Audio file format is not supported in this browser
        </audio>
      ) : null}
      <Recorder audioFileName={data.slug} />
    </main>
  );
}
