import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../../../styles/Pricing.module.css';

type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes: string;
};

type Expense = {
  id: string;
  category: string;
  description: string;
  amount: number;
};

export default function PricingPage() {
  const router = useRouter();
  const { id } = router.query;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({ category: 'accommodation', description: '', amount: '' });

  const categories = ['accommodation', 'food', 'transportation', 'activities', 'shopping', 'other'];

  useEffect(() => {
    if (!id) return;
    
    const storedTrips = localStorage.getItem('tp_plans');
    if (storedTrips) {
      const trips = JSON.parse(storedTrips) as Trip[];
      const foundTrip = trips.find((t) => t.id === id);
      setTrip(foundTrip || null);
    }

    const storedExpenses = localStorage.getItem(`tp_expenses_${id}`);
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses) as Expense[]);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>Trip not found</div>;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description.trim() || !newExpense.amount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
    };

    const updated = [...expenses, expense];
    setExpenses(updated);
    localStorage.setItem(`tp_expenses_${id}`, JSON.stringify(updated));
    setNewExpense({ category: 'accommodation', description: '', amount: '' });
  };

  const handleDeleteExpense = (expenseId: string) => {
    const updated = expenses.filter((e) => e.id !== expenseId);
    setExpenses(updated);
    localStorage.setItem(`tp_expenses_${id}`, JSON.stringify(updated));
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const expensesByCategory = categories.map((cat) => ({
    category: cat,
    expenses: expenses.filter((e) => e.category === cat),
    total: expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
  }));

  return (
    <>
      <Head>
        <title>Pricing - {trip.title} | TripWise</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => router.back()}>
            ← Back
          </button>
          <h1>Price Calculation for {trip.title}</h1>
        </div>

        <div className={styles.content}>
          <form className={styles.formCard} onSubmit={handleAddExpense}>
            <h2>Add Expense</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description *</label>
              <input
                id="description"
                type="text"
                placeholder="e.g., Hotel booking for 3 nights"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="amount">Amount ($) *</label>
              <input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                required
              />
            </div>

            <button type="submit" className={styles.primaryButton}>
              Add Expense
            </button>
          </form>

          <div className={styles.summaryCard}>
            <h2>Budget Summary</h2>
            <div className={styles.totalExpense}>
              <span>Total Expenses</span>
              <span className={styles.amount}>${totalExpense.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.expensesSection}>
            <h2>Expenses by Category</h2>
            {expensesByCategory.map(({ category, expenses: catExpenses, total }) => (
              catExpenses.length > 0 && (
                <div key={category} className={styles.categorySection}>
                  <div className={styles.categoryHeader}>
                    <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    <span className={styles.categoryTotal}>${total.toFixed(2)}</span>
                  </div>
                  <div className={styles.expensesList}>
                    {catExpenses.map((expense) => (
                      <div key={expense.id} className={styles.expenseItem}>
                        <div className={styles.expenseContent}>
                          <p className={styles.description}>{expense.description}</p>
                          <span className={styles.amount}>${expense.amount.toFixed(2)}</span>
                        </div>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
            {expenses.length === 0 && (
              <p className={styles.empty}>No expenses added yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
