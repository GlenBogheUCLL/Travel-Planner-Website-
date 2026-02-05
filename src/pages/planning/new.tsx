import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import TripPlanner from '../../components/trips/TripPlanner';

export default function NewTripPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('tp_user');
      if (!user) {
        router.push('/login');
      }
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Plan New Trip | TripWise</title>
        <meta name="description" content="Plan your next adventure" />
      </Head>
      <TripPlanner isSessionOnly={false} />
    </>
  );
}
