import type { AppProps } from 'next/app';
import HeaderBar from '../components/HeaderBar';
import '@styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeaderBar />
      <Component {...pageProps} />
    </>
  );
}
