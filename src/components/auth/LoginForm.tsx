import { useRouter } from 'next/router';
import { useState, type FormEvent } from 'react';
import styles from '../../styles/Login.module.css';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    // For demo purposes, we'll just store email
    localStorage.setItem('tp_user', JSON.stringify({ email }));
    window.dispatchEvent(new Event('tp-auth-change'));
    router.push('/');
  };

  return (
    <div className={styles.card}>
      <div>
        <h1>Log in to continue</h1>
        <p>Save your travel plannings and access them anytime.</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="alex@email.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">Log in</button>
      </form>
      <div className={styles.signup}>
        <p>Don't have an account?</p>
        <button 
          type="button" 
          className={styles.signupButton}
          onClick={() => router.push('/signup')}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
