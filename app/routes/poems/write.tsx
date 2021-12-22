// import type { LinksFunction } from 'remix';
import React from 'react';
import clsx from 'clsx';
import { format as prettyFormat, plugins } from 'pretty-format';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import materialDark from 'react-syntax-highlighter/dist/cjs/styles/prism/material-dark';

import PoemSegment from '~/components/poem-segment';

SyntaxHighlighter.registerLanguage('tsx', tsx);

const { ReactElement } = plugins;

// Currently browsers don't recognize the svg's `use` tag using
// the parts of svg-sprite!
// The resource http://localhost:3000/icons.svg was preloaded using link preload
// but not used within a few seconds from the window's load event.
// Please make sure it has an appropriate `as` value and it is preloaded intentionally.
/* export const links: LinksFunction = () => [
  {
    rel: 'preload',
    href: '/icons.svg',
    as: 'image',
  },
]; */

function getLengthForUnicodeString(unicodeString: string) {
  /* The following is specific to Tamil language
  unicodeString
    .replaceAll(/\p{Letter}/gu, '-')
    .replaceAll(/\p{Script=Tamil}/gu, '').length;
  */
  return (
    unicodeString
      .replaceAll(/\p{Letter}/gu, '-')
      // Note: Capital 'P' -> Not 'Common' -> any foreign language
      .replaceAll(/\P{Script=Common}/gu, '').length
  );
}

export default function PoemWritter() {
  const [poemTitle, setPoemTitle] = React.useState<string>('');
  const [poemText, setPoemText] = React.useState<string>('');
  const [contentCopied, setContentCopied] = React.useState<boolean>(false);

  function getMdxMeta(title: string = '') {
    return `---
meta:
  title: '${title}'
  description: ''
  'twitter:title': '${title}'
  'twitter:description': ''
  'twitter:image': 'https://peramsathyam.fly.dev/images/<poem_post>.jpeg'
  'og:image': 'https://peramsathyam.fly.dev/images/<poem_post>.jpeg'
---`;
  }

  function getComponentsImports() {
    return `import PoemSegment from '~/components/poem-segment';`;
  }

  function getFormattedPoem(poemText: string) {
    if (!poemText) {
      return '';
    }

    const emptyLineRegEx = /^\s*$/gm;
    const totalLines = poemText.split('\n').length;
    const maxLineLength = Math.max(
      ...poemText.split('\n').map((line) => getLengthForUnicodeString(line))
    );
    const date = new Date();
    const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const columnsClasses = clsx('columns-1', {
      'sm:columns-2': totalLines >= 60,
      'lg:columns-3': totalLines >= 120,
      'lg:columns-4': totalLines >= 160,
      'xl:columns-5': totalLines >= 200,
    });

    return prettyFormat(
      <main className="main-content">
        <h1 className="text-[coral] font-bold text-3xl">
          {`\{attributes.meta.title\}`}
        </h1>
        <article
          className={`space-y-4 min-w-[${maxLineLength}ch] ${columnsClasses}`}
        >
          {poemText
            .replaceAll(/(-)\1+\n/g, '---')
            .split('---')
            .map((section, index) => (
              <section key={index} className="section-card">
                {section.split(emptyLineRegEx).map((segment, index) => (
                  <PoemSegment key={index}>{`{\`${segment
                    .trim()
                    .replaceAll(emptyLineRegEx, '')}\`}`}</PoemSegment>
                ))}
              </section>
            ))}
        </article>
        <h3>-பெரமு</h3>
        <h4 className="text-[blueviolet]">
          {`{new Date('${dateString}').toLocaleDateString('en-gb')} அன்று
          எழுதப்பட்டது`}
        </h4>
      </main>,
      {
        plugins: [ReactElement],
      }
    );
  }

  function getMdxContent() {
    return `${getMdxMeta(
      poemTitle
    )}\n\n${getComponentsImports()}\n\n${getFormattedPoem(poemText)}`;
  }

  async function copyText() {
    await navigator.clipboard.writeText(getMdxContent());
    setContentCopied(true);
    setTimeout(() => {
      setContentCopied(false);
    }, 1000);
  }

  return (
    <main className="mx-[5vw] flex justify-center gap-4">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={poemTitle}
          placeholder="Poem title"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPoemTitle(event.target.value)
          }
          className="dark:bg-gray-700 p-4 shadow-2xl"
        />
        <textarea
          name="poem"
          id="poemWritter"
          cols={30}
          rows={22}
          value={poemText}
          placeholder="Poem content"
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            setPoemText(event.target.value)
          }
          className="dark:bg-gray-700 p-4 shadow-2xl"
        />
      </div>
      <div className="relative flex-1 max-h-[632px] overflow-auto">
        <SyntaxHighlighter
          language="tsx"
          style={materialDark}
          customStyle={{
            margin: 0,
            minHeight: '632px',
            fontSize: 'inherit',
            flex: '1 1 auto',
          }}
        >
          {getMdxContent()}
        </SyntaxHighlighter>
        <button
          aria-label="copy-content"
          onClick={copyText}
          className="absolute top-4 right-4 flex gap-2"
        >
          {contentCopied ? (
            <svg
              fill="white"
              aria-hidden="true"
              focusable="false"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <use href="/icons.svg#check-outline" />
            </svg>
          ) : (
            <svg
              fill="white"
              aria-hidden="true"
              focusable="false"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <use href="/icons.svg#content-copy" />
            </svg>
          )}
          <span>{contentCopied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </main>
  );
}
