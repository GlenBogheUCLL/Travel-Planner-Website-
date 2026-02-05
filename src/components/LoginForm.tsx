import { useRouter } from 'next/router';
import { useState, type FormEvent } from 'react';
import styles from '../styles/Login.module.css';

export default function LoginForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email.');
      return;
    }
    localStorage.setItem('tp_user', JSON.stringify({ name, email }));
    window.dispatchEvent(new Event('tp-auth-change'));
    router.push('/');
  };

  return (
    <div className={styles.card}>
      <div>
        <p className={styles.badge}>TripWise</p>
        <h1>Log in to continue</h1>
        <p>Save your travel plannings and access them anytime.</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Alex Johnson"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="alex@email.com"
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
