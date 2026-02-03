import { Calendar, MapPin, Users } from 'lucide-react';

export function EventCard({ event, onBook }) {
  const isFull =
    event.max_participants &&
    event.current_participants >= event.max_participants;

  const statusColors = {
    upcoming: 'bg-green-100 text-green-800',
    ongoing: 'bg-blue-100 text-blue-800',
    past: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusColors[event.status] || statusColors['past']
          }`}
        >
          {event.status}
        </span>
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-gray-600 mb-4">{event.description}</p>
      )}

      {/* Info */}
      <div className="space-y-2 mb-4 text-gray-700 text-sm">
        {event.event_date && (
          <div className="flex items-center">
            <Calendar size={18} className="mr-2 text-blue-600" />
            {new Date(event.event_date).toLocaleString()}
          </div>
        )}
        {event.location && (
          <div className="flex items-center">
            <MapPin size={18} className="mr-2 text-red-600" />
            {event.location}
          </div>
        )}
        {event.max_participants && (
          <div className="flex items-center">
            <Users size={18} className="mr-2 text-green-600" />
            {event.current_participants} / {event.max_participants} participants
          </div>
        )}
      </div>

      {/* Category */}
      {event.category && (
        <span className="inline-block mb-4 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
          {event.category}
        </span>
      )}

      {/* Book Button */}
      <button
        onClick={() => onBook(event.id)}
        disabled={isFull || event.status !== 'upcoming'}
        className={`w-full py-2 rounded-lg text-white transition-colors font-medium ${
          isFull || event.status !== 'upcoming'
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
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
