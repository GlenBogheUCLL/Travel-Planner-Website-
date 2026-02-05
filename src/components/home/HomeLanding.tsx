import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import styles from '../../styles/Home.module.css';

type Planning = {
  id: string;
  title: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
};

export default function HomeLanding() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [plans, setPlans] = useState<Planning[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const refreshFromStorage = () => {
      const storedUser = localStorage.getItem('tp_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as { name?: string };
        setIsLoggedIn(true);
        setUserName(parsed?.name ?? 'Traveler');
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }

      const storedPlans = localStorage.getItem('tp_plans');
      setPlans(storedPlans ? (JSON.parse(storedPlans) as Planning[]) : []);
    };

    refreshFromStorage();
    window.addEventListener('storage', refreshFromStorage);
    window.addEventListener('tp-auth-change', refreshFromStorage);
    return () => {
      window.removeEventListener('storage', refreshFromStorage);
      window.removeEventListener('tp-auth-change', refreshFromStorage);
    };
  }, []);

  const greeting = useMemo(
    () => (isLoggedIn ? `Welcome back, ${userName}` : 'Plan your next adventure'),
    [isLoggedIn, userName]
  );

  const handleTripClick = (tripId: string) => {
    router.push(`/trips/${tripId}`);
  };

  return (
    <>
      <section className={styles.hero}>
        <div>
          <h1>{greeting}</h1>
          <p>
            {isLoggedIn
              ? 'Start a new adventure or pick up one of your saved travel plans.'
              : 'Log in to save your plans or create a session-only trip planning.'}
          </p>
        </div>
        <div className={styles.heroActions}>
          {isLoggedIn ? (
            <Link className={styles.primaryButton} href="/planning/new">
              Start new adventure
            </Link>
          ) : (
            <>
              <Link className={styles.primaryButton} href="/login">
                Log in
              </Link>
              <Link className={styles.secondaryButton} href="/planning/session">
                Planning during session only
              </Link>
            </>
          )}
        </div>
      </section>

      {isLoggedIn && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Your planned trips</h2>
            <p>All trips you have saved will show up here.</p>
          </div>

          {plans.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No plans yet</h3>
              <p>Create a new adventure to see it listed here.</p>
            </div>
          ) : (
            <div className={styles.cardGrid}>
              {plans.map((plan) => (
                <article 
                  key={plan.id} 
                  className={styles.card}
                  onClick={() => handleTripClick(plan.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleTripClick(plan.id);
                    }
                  }}
                >
                  <div>
                    <h3>{plan.title}</h3>
                    {plan.destination && (
                      <p className={styles.cardDestination}>{plan.destination}</p>
                    )}
                  </div>
                  {(plan.startDate || plan.endDate) && (
                    <div className={styles.cardMeta}>
                      <span>{plan.startDate || 'Start date'}</span>
                      <span>•</span>
                      <span>{plan.endDate || 'End date'}</span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
