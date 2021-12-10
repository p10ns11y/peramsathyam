import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from 'remix';
import type { LinksFunction } from 'remix';

import resetStyles from '~/styles/reset.css';
import tailwindStyles from '~/styles/tailwind.css';

export let links: LinksFunction = () => {
  return [
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
      <body className="dark:bg-gray-900 bg-white transition duration-500">
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
          <Link
            to="/"
            title="PeramSathyam"
            className="font-bold text-2xl text-pink-700 hover:text-pink-500"
          >
            <h1>Peram Sathyam</h1>
          </Link>
          <nav aria-label="Main navigation">
            <ul className="list-none m-0 flex justify-between items-center gap-6">
              <li className="font-bold">
                <Link to="/" className="text-pink-700 hover:text-pink-500">
                  Home
                </Link>
              </li>
              <li className="font-bold">
                <Link to="/poems" className="text-pink-700 hover:text-pink-500">
                  Poems
                </Link>
              </li>
              <li className="font-bold">
                <a
                  href="https://github.com/p10ns11y"
                  className="text-pink-700 hover:text-pink-500"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="py-4 flex justify-center items-center">
        <p className="text-[coral]">&copy; Peramanathan Sathyamoorthy</p>
      </footer>
    </div>
  );
}
