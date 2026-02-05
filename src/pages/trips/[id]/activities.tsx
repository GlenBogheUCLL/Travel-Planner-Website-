import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../../../styles/Activities.module.css';

type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes: string;
};

type Activity = {
  id: string;
  day: number;
  title: string;
  description: string;
  time: string;
};

export default function ActivitiesPage() {
  const router = useRouter();
  const { id } = router.query;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newActivity, setNewActivity] = useState({ day: 1, title: '', description: '', time: '' });

  useEffect(() => {
    if (!id) return;
    
    const storedTrips = localStorage.getItem('tp_plans');
    if (storedTrips) {
      const trips = JSON.parse(storedTrips) as Trip[];
      const foundTrip = trips.find((t) => t.id === id);
      setTrip(foundTrip || null);
    }

    const storedActivities = localStorage.getItem(`tp_activities_${id}`);
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities) as Activity[]);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>Trip not found</div>;

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.title.trim()) return;

    const activity: Activity = {
      id: Date.now().toString(),
      day: newActivity.day,
      title: newActivity.title,
      description: newActivity.description,
      time: newActivity.time,
    };

    const updated = [...activities, activity];
    setActivities(updated);
    localStorage.setItem(`tp_activities_${id}`, JSON.stringify(updated));
    setNewActivity({ day: 1, title: '', description: '', time: '' });
  };

  const handleDeleteActivity = (activityId: string) => {
    const updated = activities.filter((a) => a.id !== activityId);
    setActivities(updated);
    localStorage.setItem(`tp_activities_${id}`, JSON.stringify(updated));
  };

  const activitysByDay = Array.from({ length: durationDays }, (_, i) => i + 1).map((day) => ({
    day,
    date: new Date(startDate.getTime() + (day - 1) * 24 * 60 * 60 * 1000),
    activities: activities.filter((a) => a.day === day),
  }));

  return (
    <>
      <Head>
        <title>Activities - {trip.title} | TripWise</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => router.back()}>
            ← Back
          </button>
          <h1>Activities for {trip.title}</h1>
        </div>

        <div className={styles.content}>
          <form className={styles.formCard} onSubmit={handleAddActivity}>
            <h2>Add Activity</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="day">Day *</label>
              <select
                id="day"
                value={newActivity.day}
                onChange={(e) => setNewActivity({ ...newActivity, day: parseInt(e.target.value) })}
              >
                {Array.from({ length: durationDays }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    Day {day} - {new Date(startDate.getTime() + (day - 1) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="time">Time</label>
              <input
                id="time"
                type="time"
                value={newActivity.time}
                onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="title">Activity Title *</label>
              <input
                id="title"
                type="text"
                placeholder="e.g., Visit the Colosseum"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Add details about this activity..."
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                rows={3}
              />
            </div>

            <button type="submit" className={styles.primaryButton}>
              Add Activity
            </button>
          </form>

          <div className={styles.activitiesSection}>
            <h2>Your Activities</h2>
            {activitysByDay.map(({ day, date, activities: dayActivities }) => (
              <div key={day} className={styles.daySection}>
                <h3>Day {day} - {date.toLocaleDateString()}</h3>
                {dayActivities.length === 0 ? (
                  <p className={styles.empty}>No activities planned for this day</p>
                ) : (
                  <div className={styles.activitiesList}>
                    {dayActivities.map((activity) => (
                      <div key={activity.id} className={styles.activityItem}>
                        <div className={styles.activityContent}>
                          {activity.time && <span className={styles.time}>{activity.time}</span>}
                          <div>
                            <h4>{activity.title}</h4>
                            {activity.description && <p>{activity.description}</p>}
                          </div>
                        </div>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteActivity(activity.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
