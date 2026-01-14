import { Gift } from "lucide-react";

function RewardItemCard({ item, userPoints, onRedeem }) {
  const canAfford = userPoints >= item.points;
  const inStock = item.stock > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      
      {/* Image / Icon */}
      <div className="flex items-center justify-center mb-4 h-32 bg-blue-100 rounded-lg">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover rounded-lg"
          />
        ) : (
          <Gift size={40} className="text-blue-600" />
        )}
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {item.name}
      </h3>

      {/* Description */}
      {item.description && (
        <p className="text-sm text-gray-600 mb-4">
          {item.description}
        </p>
      )}

      {/* Points & Stock */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold text-blue-600">
          {item.points} pts
        </span>
        <span className="text-sm text-gray-500">
          Stock: {item.stock}
        </span>
      </div>

      {/* Redeem Button */}
      <button
        onClick={() => onRedeem(item.id)}
        disabled={!canAfford || !inStock}
        className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:bg-gray-300"
      >
        {!inStock
          ? "Out of Stock"
          : !canAfford
          ? "Not Enough Points"
          : "Redeem"}
      </button>
    </div>
  );
}

export default RewardItemCard;
