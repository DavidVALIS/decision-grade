import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/introduction/');
  }, [router]);
  return (
    <>
      <Head>
        <title>Decision-Grade AI</title>
        <meta httpEquiv="refresh" content="0; url=/introduction/" />
        <link rel="canonical" href="/introduction/" />
      </Head>
      <main style={{ padding: 32, fontFamily: 'var(--font-sans)' }}>
        <p>Redirecting to <a href="/introduction/">Introduction</a>...</p>
      </main>
    </>
  );
}
