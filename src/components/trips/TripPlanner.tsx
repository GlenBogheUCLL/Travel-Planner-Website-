import { useRouter } from 'next/router';
import { useEffect, useState, type FormEvent } from 'react';
import styles from '../../styles/Trip.module.css';

type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes: string;
};

type TripPlannerProps = {
  isSessionOnly?: boolean;
};

export default function TripPlanner({ isSessionOnly = false }: TripPlannerProps) {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load trips from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined' || isSessionOnly) return;
    const storedTrips = localStorage.getItem('tp_plans');
    if (storedTrips) {
      setTrips(JSON.parse(storedTrips) as Trip[]);
    }
  }, [isSessionOnly]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.destination.trim() || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    let newTripId = editingId;
    
    if (editingId) {
      const updatedTrips = trips.map((trip) =>
        trip.id === editingId
          ? {
              ...trip,
              ...formData,
            }
          : trip
      );
      setTrips(updatedTrips);
      if (!isSessionOnly) {
        localStorage.setItem('tp_plans', JSON.stringify(updatedTrips));
      }
      setEditingId(null);
    } else {
      newTripId = Date.now().toString();
      const newTrip: Trip = {
        id: newTripId,
        ...formData,
      };
      const updatedTrips = [newTrip, ...trips];
      setTrips(updatedTrips);
      if (!isSessionOnly) {
        localStorage.setItem('tp_plans', JSON.stringify(updatedTrips));
        // Redirect to trip detail page
        router.push(`/trips/${newTripId}`);
        return;
      }
    }

    setFormData({
      title: '',
      destination: '',
      startDate: '',
      endDate: '',
      notes: '',
    });
  };

  const handleEdit = (trip: Trip) => {
    setFormData({
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      notes: trip.notes,
    });
    setEditingId(trip.id);
  };

  const handleDelete = (id: string) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
    if (!isSessionOnly) {
      localStorage.setItem('tp_plans', JSON.stringify(trips.filter((t) => t.id !== id)));
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: '',
      destination: '',
      startDate: '',
      endDate: '',
      notes: '',
    });
  };

  return (
    <div className={styles.planner}>
      <div className={styles.header}>
        <h1>{isSessionOnly ? 'Session Trip Planner' : 'My Trip Planner'}</h1>
        <p>
          {isSessionOnly
            ? 'Plan your trips for this session only (not saved)'
            : 'Plan your trips and save them for later'}
        </p>
      </div>

      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h2>{editingId ? 'Edit Trip' : 'Create New Trip'}</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="title">Trip Title *</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Summer Vacation to Italy"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="destination">Destination *</label>
              <input
                id="destination"
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="e.g., Rome, Italy"
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="startDate">Start Date *</label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endDate">End Date *</label>
                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any notes about your trip..."
                rows={4}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.primaryButton}>
                {editingId ? 'Update Trip' : 'Add Trip'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
