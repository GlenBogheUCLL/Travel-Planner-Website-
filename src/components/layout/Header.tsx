import { useRouter } from 'next/router';
import styles from '../../styles/Header.module.css';

export default function Header() {
  const router = useRouter();
  
  return (
    <header>
      <nav>
        <h1>Travel Planner</h1>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/destinations">Destinations</a></li>
          <li><a href="/trips">My Trips</a></li>
        </ul>
        <button 
          className={styles.signupButton}
          onClick={() => router.push('/signup')}
        >
          Create Account
        </button>
      </nav>
    </header>
  );
}
