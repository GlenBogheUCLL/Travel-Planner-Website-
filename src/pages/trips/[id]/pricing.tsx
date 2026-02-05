import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from '../../../styles/Pricing.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

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

type Activity = {
  id: string;
  day: number;
  title: string;
  description: string;
  time: string;
  price?: number;
};

export default function PricingPage() {
  const router = useRouter();
  const { id } = router.query;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'breakdown' | 'distribution'>('breakdown');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('activities');
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

    const storedActivities = localStorage.getItem(`tp_activities_${id}`);
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities) as Activity[]);
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

  // Get activities with prices
  const activitiesWithPrice = activities.filter((a) => a.price !== undefined && a.price > 0);
  const activitiesPriceTotal = activitiesWithPrice.reduce((sum, a) => sum + (a.price || 0), 0);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0) + activitiesPriceTotal;

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

          <div className={styles.rightColumn}>
            <div className={styles.summaryCard}>
              <h2>Budget Summary</h2>
              <div className={styles.totalExpense}>
                <span>Total Expenses</span>
                <span className={styles.amount}>${totalExpense.toFixed(2)}</span>
              </div>
            </div>

            {(activitiesWithPrice.length > 0 || expenses.length > 0) && (
              <div className={styles.viewTabs}>
                <button
                  className={`${styles.tabButton} ${activeView === 'breakdown' ? styles.activeTab : ''}`}
                  onClick={() => setActiveView('breakdown')}
                >
                  Breakdown
                </button>
                <button
                  className={`${styles.tabButton} ${activeView === 'distribution' ? styles.activeTab : ''}`}
                  onClick={() => setActiveView('distribution')}
                >
                  Distribution
                </button>
              </div>
            )}

            {activeView === 'breakdown' ? (
              <div className={styles.expensesSection}>
            <div className={styles.categorySelector}>
              <label htmlFor="categoryDropdown">Expenses by Category:</label>
              <select
                id="categoryDropdown"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">-- Select a Category --</option>
                {activitiesWithPrice.length > 0 && (
                  <option value="activities">Activities (${activitiesPriceTotal.toFixed(2)})</option>
                )}
                {categories.map((cat) => {
                  const catExpenses = expenses.filter((e) => e.category === cat);
                  const catTotal = catExpenses.reduce((sum, e) => sum + e.amount, 0);
                  return catExpenses.length > 0 ? (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)} (${catTotal.toFixed(2)})
                    </option>
                  ) : null;
                })}
              </select>
            </div>

            {selectedCategory === 'activities' && activitiesWithPrice.length > 0 && (
              <div className={styles.categoryDetail}>
                <div className={styles.categoryDetailHeader}>
                  <h3>Activities</h3>
                  <span className={styles.categoryDetailTotal}>${activitiesPriceTotal.toFixed(2)}</span>
                </div>
                <div className={styles.expensesList}>
                  {activitiesWithPrice.map((activity) => (
                    <div key={activity.id} className={styles.expenseItem}>
                      <div className={styles.expenseContent}>
                        <p className={styles.description}>{activity.title}</p>
                        <span className={styles.amount}>${activity.price?.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCategory && selectedCategory !== 'activities' && (() => {
              const catExpenses = expenses.filter((e) => e.category === selectedCategory);
              const catTotal = catExpenses.reduce((sum, e) => sum + e.amount, 0);
              return catExpenses.length > 0 ? (
                <div className={styles.categoryDetail}>
                  <div className={styles.categoryDetailHeader}>
                    <h3>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h3>
                    <span className={styles.categoryDetailTotal}>${catTotal.toFixed(2)}</span>
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
              ) : null;
            })()}

            {!selectedCategory && expenses.length === 0 && activitiesWithPrice.length === 0 && (
              <p className={styles.empty}>No expenses added yet</p>
            )}
            </div>
            ) : (
              <div className={styles.distributionCard}>
                <h2>Expense Distribution</h2>
                <div className={styles.largeChartContainer}>
                  <Pie
                    data={{
                      labels: [
                        ...(activitiesWithPrice.length > 0 ? ['Activities'] : []),
                        ...categories
                          .filter((cat) => expenses.filter((e) => e.category === cat).length > 0)
                          .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)),
                      ],
                      datasets: [
                        {
                          data: [
                            ...(activitiesWithPrice.length > 0 ? [activitiesPriceTotal] : []),
                            ...categories
                              .filter((cat) => expenses.filter((e) => e.category === cat).length > 0)
                              .map((cat) =>
                                expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
                              ),
                          ],
                          backgroundColor: [
                            '#10b981',
                            '#4c6ef5',
                            '#f59e0b',
                            '#ef4444',
                            '#8b5cf6',
                            '#ec4899',
                          ],
                          borderColor: '#fff',
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                          labels: {
                            font: { size: 14 },
                            padding: 15,
                            color: '#64748b',
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.label || '';
                              const value = context.parsed || 0;
                              const total = context.dataset.data.reduce((a, b) => (a as number) + (b as number), 0) as number;
                              const percentage = ((value / total) * 100).toFixed(1);
                              return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
