import Head from 'next/head';
import TripPlanner from '../../components/trips/TripPlanner';

export default function SessionPlanningPage() {
  return (
    <>
      <Head>
        <title>Session Trip Planning | TripWise</title>
        <meta name="description" content="Plan your trips for this session only" />
      </Head>
      <TripPlanner isSessionOnly={true} />
    </>
  );
}
