import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../../../../styles/Activities.module.css';

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
  price?: number;
};

export default function SessionActivitiesPage() {
  const router = useRouter();
  const { id } = router.query;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState(1);
  const [durationDays, setDurationDays] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [newActivity, setNewActivity] = useState({ title: '', description: '', time: '', price: '' });

  useEffect(() => {
    if (!id) return;
    
    const storedTrips = sessionStorage.getItem('tp_session_trips');
    if (storedTrips) {
      const trips = JSON.parse(storedTrips) as Trip[];
      const foundTrip = trips.find((t) => t.id === id);
      if (foundTrip) {
        setTrip(foundTrip);
        const start = new Date(foundTrip.startDate);
        const end = new Date(foundTrip.endDate);
        const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        setStartDate(start);
        setDurationDays(duration);
      }
    }

    const storedActivities = sessionStorage.getItem(`tp_session_activities_${id}`);
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities) as Activity[]);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!trip || !startDate) return <div>Trip not found</div>;

  const currentDate = new Date(startDate.getTime() + (currentDay - 1) * 24 * 60 * 60 * 1000);
  const dayActivities = activities
    .filter((a) => a.day === currentDay)
    .sort((a, b) => {
      if (!a.time || !b.time) return 0;
      return a.time.localeCompare(b.time);
    });

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.title.trim()) return;

    const activity: Activity = {
      id: Date.now().toString(),
      day: currentDay,
      title: newActivity.title,
      description: newActivity.description,
      time: newActivity.time,
      price: newActivity.price ? parseFloat(newActivity.price) : undefined,
    };

    const updated = [...activities, activity];
    setActivities(updated);
    sessionStorage.setItem(`tp_session_activities_${id}`, JSON.stringify(updated));
    setNewActivity({ title: '', description: '', time: '', price: '' });
    setShowModal(false);
  };

  const handleDeleteActivity = (activityId: string) => {
    const updated = activities.filter((a) => a.id !== activityId);
    setActivities(updated);
    sessionStorage.setItem(`tp_session_activities_${id}`, JSON.stringify(updated));
  };

  const goToPreviousDay = () => {
    if (currentDay > 1) setCurrentDay(currentDay - 1);
  };

  const goToNextDay = () => {
    if (currentDay < durationDays) setCurrentDay(currentDay + 1);
  };

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

        <div className={styles.dayNavigationContainer}>
          <div className={styles.navigationControls}>
            <button
              className={styles.navButton}
              onClick={goToPreviousDay}
              disabled={currentDay === 1}
            >
              ←
            </button>

            <div className={styles.dayCardContainer}>
              <div className={styles.dayCard}>
                <div className={styles.dayHeader}>
                  <h2>
                    Day {currentDay}
                  </h2>
                  <p className={styles.dateText}>{currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>

                {dayActivities.length === 0 ? (
                  <div className={styles.emptyDay}>
                    <p>No activities planned for this day</p>
                  </div>
                ) : (
                  <div className={styles.activitiesList}>
                    {dayActivities.map((activity) => (
                      <div key={activity.id} className={styles.activityItem}>
                        <div className={styles.activityContent}>
                          {activity.time && (
                            <span className={styles.time}>{activity.time}</span>
                          )}
                          <div className={styles.activityDetails}>
                            <h4>{activity.title}</h4>
                            {activity.description && <p className={styles.description}>{activity.description}</p>}
                          </div>
                        </div>
                        <div className={styles.activityMeta}>
                          {activity.price !== undefined && (
                            <span className={styles.price}>${activity.price.toFixed(2)}</span>
                          )}
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteActivity(activity.id)}
                            title="Delete activity"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className={styles.addActivityButton}
                  onClick={() => setShowModal(true)}
                  title="Add activity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              className={styles.navButton}
              onClick={goToNextDay}
              disabled={currentDay === durationDays}
            >
              →
            </button>
          </div>

          {/* Add Activity Modal */}
          {showModal && (
            <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h2>Add Activity</h2>
                  <button
                    className={styles.closeButton}
                    onClick={() => setShowModal(false)}
                    title="Close modal"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddActivity} className={styles.modalForm}>
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

                  <div className={styles.formGroup}>
                    <label htmlFor="price">Price (Optional - leave empty for free)</label>
                    <input
                      id="price"
                      type="number"
                      placeholder="e.g., 25.99"
                      step="0.01"
                      min="0"
                      value={newActivity.price}
                      onChange={(e) => setNewActivity({ ...newActivity, price: e.target.value })}
                    />
                  </div>

                  <div className={styles.modalButtonGroup}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={styles.primaryButton}>
                      Add Activity
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
