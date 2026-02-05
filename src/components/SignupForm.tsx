import { useRouter } from 'next/router';
import { useState, type FormEvent } from 'react';
import styles from '../styles/Login.module.css';

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    localStorage.setItem('tp_user', JSON.stringify({ name, email }));
    window.dispatchEvent(new Event('tp-auth-change'));
    router.push('/');
  };

  return (
    <div className={styles.card}>
      <div>
        <h1>Create your account</h1>
        <p>Join us to start planning your next adventure.</p>
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
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter at least 6 characters"
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">Create Account</button>
      </form>
      <div className={styles.signup}>
        <p>Already have an account?</p>
        <button 
          type="button" 
          className={styles.signupButton}
          onClick={() => router.push('/login')}
        >
          Log In
        </button>
      </div>
    </div>
  );
}
