import type { AppProps } from 'next/app';
import Head from 'next/head';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark" />
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='10.3' y='2.3' width='3.4' height='3.4' fill='%23E79583'/%3E%3Crect x='2.3' y='10.3' width='3.4' height='3.4' fill='%23E79583' opacity='0.72'/%3E%3Crect x='18.3' y='10.3' width='3.4' height='3.4' fill='%23E79583' opacity='0.48'/%3E%3Crect x='10.3' y='18.3' width='3.4' height='3.4' fill='%23E79583' opacity='0.85'/%3E%3Crect x='10.3' y='10.3' width='3.4' height='3.4' fill='%23E79583' opacity='0.58'/%3E%3C/svg%3E" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
