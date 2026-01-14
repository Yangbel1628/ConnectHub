import { Calendar, MapPin, Users } from 'lucide-react';

export function EventCard({ event, onBook }) {
  const isFull =
    event.max_participants &&
    event.current_participants >= event.max_participants;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          {event.title}
        </h3>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            event.status === 'upcoming'
              ? 'bg-green-100 text-green-800'
              : event.status === 'ongoing'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {event.status}
        </span>
      </div>

      {event.description && (
        <p className="text-gray-600 mb-4">
          {event.description}
        </p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-700">
          <Calendar size={18} className="mr-2 text-blue-600" />
          <span className="text-sm">
            {new Date(event.event_date).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center text-gray-700">
          <MapPin size={18} className="mr-2 text-red-600" />
          <span className="text-sm">{event.location}</span>
        </div>

        {event.max_participants && (
          <div className="flex items-center text-gray-700">
            <Users size={18} className="mr-2 text-green-600" />
            <span className="text-sm">
              {event.current_participants} / {event.max_participants} participants
            </span>
          </div>
        )}
      </div>

      {event.category && (
        <span className="inline-block mb-4 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
          {event.category}
        </span>
      )}

      <button
        onClick={() => onBook(event.id)}
        disabled={isFull || event.status !== 'upcoming'}
        className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:bg-gray-300"
      >
        {isFull
          ? 'Event Full'
          : event.status !== 'upcoming'
          ? 'Not Available'
          : 'Book Now'}
      </button>
    </div>
  );
}
