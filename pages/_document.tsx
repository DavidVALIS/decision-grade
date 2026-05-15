import { Html, Head, Main, NextScript } from 'next/document';

// Inline boot script that sets [data-theme] before first paint so the page
// does not flash the wrong theme on load. Reads localStorage first, falls
// back to prefers-color-scheme, defaults to dark.
const themeBoot = `
(function(){try{
  var s=localStorage.getItem('dg-theme');
  var t=(s==='light'||s==='dark')?s:((window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark');
  document.documentElement.setAttribute('data-theme',t);
}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();
`;

export default function Document() {
  return (
    <Html lang="en" data-bg="warm" data-theme="dark">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
