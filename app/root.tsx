import type { LinksFunction, MetaFunction } from "@remix-run/node";

import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";

import resetStyles from '~/styles/reset.css';
import tailwindStyles from '~/styles/tailwind.css';

export let meta: MetaFunction = () => {
  let description = `Peramanathan Sathyamoorthy's personal website.`;
  return {
    description,
    keywords: 'poems,blog,react,remix,typescript,tailwindcss',
    'twitter:image': 'https://peramsathyam.fly.dev/images/profile.jpeg',
    'twitter:card': 'summary_large_image',
    'twitter:creator': '@peramanathan',
    'twitter:site': '@peramanathan',
    'twitter:title': 'Peramanathan Sathyamoorthy',
    'twitter:description': description,
  };
};

export let links: LinksFunction = () => {
  return [
    // https://csswizardry.com/2020/05/the-fastest-google-fonts/
    // Preemptively warm up the fonts’ origin.
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    // Initiate a high-priority, asynchronous fetch for the CSS file.
    {
      rel: 'preload',
      href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap',
      as: 'style',
    },
    // Initiate a low-priority, asynchronous fetch that gets applied to the page
    // only after it’s arrived. Works in all browsers with JavaScript enabled.
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap',
    },
    { rel: 'stylesheet', href: resetStyles },
    { rel: 'stylesheet', href: tailwindStyles },
  ];
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="bg-white dark:bg-gray-900 dark:bg-dark-radial-body transition duration-500">
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="root"
      className="flex flex-col dark:text-white text-black min-h-full"
    >
      <header className="px-[5vw] py-9 lg:py-12">
        <div className="flex justify-between items-center">
          <Link to="/" title="PeramSathyam">
            <h1 className="font-bold text-2xl text-pink-700 hover:text-pink-500">
              Peram Sathyam
            </h1>
          </Link>
          <nav aria-label="Main navigation">
            <ul className="list-none m-0 flex flex-wrap justify-between items-center gap-6">
              <li className="font-bold">
                <Link to="/poems" className="text-pink-700 hover:text-pink-500">
                  Poems
                </Link>
              </li>
              {/* <li className="font-bold">
                <a
                  href="https://github.com/p10ns11y"
                  className="text-pink-700 hover:text-pink-500"
                >
                  GitHub
                </a>
              </li> */}
            </ul>
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="py-4 flex justify-center items-center">
        <p className="text-[#ff5085]">&copy; Peramanathan Sathyamoorthy</p>
      </footer>
    </div>
  );
}
