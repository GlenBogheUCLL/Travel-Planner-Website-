import Head from 'next/head';
import SignupForm from '../../components/auth/SignupForm';
import styles from '../../styles/Login.module.css';

export default function SignupPage() {
  return (
    <>
      <Head>
        <title>Sign Up | TripWise</title>
        <meta name="description" content="Create an account to save your travel plannings" />
      </Head>
      <main className={styles.main}>
        <SignupForm />
      </main>
    </>
  );
}
