import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../../styles/TripDetail.module.css';

type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes: string;
};

export default function TripDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const storedTrips = localStorage.getItem('tp_plans');
    if (storedTrips) {
      const trips = JSON.parse(storedTrips) as Trip[];
      const foundTrip = trips.find((t) => t.id === id);
      setTrip(foundTrip || null);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>Trip not found</div>;

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <>
      <Head>
        <title>{trip.title} | TripWise</title>
        <meta name="description" content={`Plan your ${trip.title}`} />
      </Head>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => router.back()}>
            ← Back
          </button>
          <div className={styles.headerContent}>
            <h1>{trip.title}</h1>
            <p className={styles.destination}>{trip.destination}</p>
            <p className={styles.dates}>
              {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
              <span className={styles.duration}>({durationDays} days)</span>
            </p>
            {trip.notes && <p className={styles.notes}>{trip.notes}</p>}
          </div>
        </div>

        <div className={styles.menuGrid}>
          <Link href={`/trips/${trip.id}/activities`} className={styles.card}>
            <div className={styles.cardIcon}>📅</div>
            <h2>Day by Day Activities</h2>
            <p>Plan activities for each day of your trip</p>
          </Link>

          <Link href={`/trips/${trip.id}/pricing`} className={styles.card}>
            <div className={styles.cardIcon}>💰</div>
            <h2>Price Calculation</h2>
            <p>Track expenses and budget for your trip</p>
          </Link>
        </div>
      </div>
    </>
  );
}
