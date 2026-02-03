import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Make sure it points to your AuthContext
import { EventCard } from "../components/Event/EventCard";
import { Calendar } from "lucide-react";

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Load events from localStorage
    const loadEvents = () => {
      const eventsData = JSON.parse(localStorage.getItem("events")) || [];
      setEvents(eventsData);
      setLoading(false);
    };

    loadEvents();
  }, []);

  const handleBook = (eventId) => {
    if (!user) return;

    const bookings = JSON.parse(localStorage.getItem("event_bookings")) || [];

    const alreadyBooked = bookings.find(
      (b) => b.event_id === eventId && b.user_id === user._id // use user._id from AuthContext
    );
    if (alreadyBooked) return;

    bookings.push({
      id: Date.now().toString(),
      event_id: eventId,
      user_id: user._id, // consistent with AuthContext
      booked_at: new Date().toISOString(),
    });
    localStorage.setItem("event_bookings", JSON.stringify(bookings));

    // Update event participant count
    const eventsData = JSON.parse(localStorage.getItem("events")) || [];
    const updatedEvents = eventsData.map((e) =>
      e.id === eventId
        ? { ...e, current_participants: (e.current_participants || 0) + 1 }
        : e
    );
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    setEvents(updatedEvents);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3">
          <Calendar size={32} className="text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Events & Meetups</h1>
            <p className="text-gray-600">Discover and join amazing events</p>
          </div>
        </div>
      </div>

      {/* Events list */}
      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No events available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onBook={handleBook} />
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsPage;
