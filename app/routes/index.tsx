import type { MetaFunction, LinksFunction } from 'remix';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import ts from 'react-syntax-highlighter/dist/cjs/languages/hljs/typescript';
import nightOwl from 'react-syntax-highlighter/dist/cjs/styles/hljs/night-owl';

SyntaxHighlighter.registerLanguage('typescript', ts);

export let meta: MetaFunction = () => {
  return {
    title: 'Peramanathan Sathyamoorthy',
    description: 'Welcome to my personal website',
  };
};

export default function Index() {
  return (
    <main className="mx-[5vw] flex justify-center items-start flex-wrap gap-4">
      <h2 className="w-min h-auto p-4 dark:bg-gray-800 text-2xl font-bold rounded-lg shadow-2xl">
        Hi, I am{' '}
        <strong style={{ color: '#797900' }}>Peramanathan Sathyamoorthy</strong>
        , a <strong style={{ color: '#008383' }}>software engineer</strong>{' '}
        based in Stockholm, Sweden. I am passionate about{' '}
        <strong style={{ color: 'blueviolet' }}>crafting software</strong> and{' '}
        <strong style={{ color: 'coral' }}>writing poems</strong> in Tamil
      </h2>
      <section className="font-mono flex flex-wrap justify-center items-start flex-1 text-[6px] sm:text-[12px] lg:text-base rounded-lg gap-4">
        <SyntaxHighlighter
          language="typescript"
          style={nightOwl}
          customStyle={{
            fontSize: 'inherit',
            flex: '1 1 auto',
            fontFamily: 'inherit',
            borderRadius: '0.5rem',
          }}
        >
          {codeSnippet}
        </SyntaxHighlighter>
        <pre className="text-lg p-4 dark:bg-gray-800 rounded-lg shadow-2xl font-mono">
          <code>{poem}</code>
        </pre>
      </section>
    </main>
  );
}

const codeSnippet = `import type { Arguments, Argv } from 'yargs';
import { getDefaultBranch, gracefulPush } from '../git';
import { run } from '../run';

type Options = {
  action: string;
};

export const command: string = '$0 <action>';
export const desc: string = 'Run git cli commands and show the steps';

export function builder(yargs: Argv<Options>) {
  yargs.positional('action', { type: 'string', demandOption: true });
}

export async function handler(argv: Arguments<Options>) {
  const { action } = argv;

  const defaultBranch = await getDefaultBranch();

  if (action?.match(/rebase/g)) {
    const steps: Array<string | Function> = [
      \`git checkout \${defaultBranch}\`,
      \`git pull --rebase\`,
      \`git checkout -\`,
      \`git rebase \${defaultBranch}\`,
    ];

    if (action.match(/push|then push/g)) {
      steps.push(() => gracefulPush({ withForce: true }));
    }

    steps.forEach((step) => run(step));
  }

  process.exit(0);
}
`;

const poem = `அகலா விளக்கு

நெஞ்சம்
சுடர்விட ஏங்கும்
நெய் இழையிட்ட
அகல் விளக்கு!

‘பொறி’யென
கண்கள்
உரசி பற்றிக்
கொண்டதும்
இணை நெஞ்சங்கள்
வேண்டுவது
அன்பெனும்
அகலா விளக்கு!

   - பெரமு
`;
