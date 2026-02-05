import Head from 'next/head';
import HomeLanding from '../../components/HomeLanding';
import styles from '../../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>TripWise</title>
        <meta name="description" content="Plan your next adventure" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <HomeLanding />
      </main>
    </>
  );
}
