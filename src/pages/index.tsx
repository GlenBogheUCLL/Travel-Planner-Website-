import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Travel Planner</title>
        <meta name="description" content="Plan your next adventure" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Welcome to Travel Planner</h1>
        <p>Plan your next adventure with ease!</p>
      </main>
    </>
  );
}
