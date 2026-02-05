import Head from 'next/head';
import LoginForm from '../../components/LoginForm';
import styles from '../../styles/Login.module.css';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Log in | Travel Planner</title>
        <meta name="description" content="Log in to save your travel plannings" />
      </Head>
      <main className={styles.main}>
        <LoginForm />
      </main>
    </>
  );
}
