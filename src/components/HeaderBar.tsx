import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/Header.module.css';

type User = {
  name?: string;
};

export default function HeaderBar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const readUser = () => {
      const stored = localStorage.getItem('tp_user');
      setUser(stored ? (JSON.parse(stored) as User) : null);
    };

    readUser();
    window.addEventListener('storage', readUser);
    return () => window.removeEventListener('storage', readUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tp_user');
    setUser(null);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.logo}>W</span>
          <Link className={styles.title} href="/">
            WanderCraft
          </Link>
        </div>
        <div className={styles.actions}>
          {user ? (
            <>
              <span className={styles.greeting}>Hi, {user.name ?? 'Traveler'}</span>
              <button className={styles.ghostButton} onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <Link className={styles.ghostButton} href="/login">
              Log in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
