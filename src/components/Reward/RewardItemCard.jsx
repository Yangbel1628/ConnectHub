import { Gift } from "lucide-react";

function RewardItemCard({ item, userPoints, onRedeem }) {
  const canAfford = userPoints >= item.points;
  const inStock = item.stock > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col justify-between">
      
      {/* Image / Icon */}
      <div className="flex items-center justify-center mb-4 h-32 bg-blue-100 rounded-lg overflow-hidden">
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

      {/* Name & Description */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-gray-600">{item.description}</p>
        )}
      </div>

      {/* Points & Stock */}
      <div className="flex justify-between items-center mb-4 text-sm">
        <span className="font-semibold text-blue-600">{item.points} pts</span>
        <span className={`text-gray-500 ${inStock ? "" : "line-through"}`}>
          Stock: {item.stock}
        </span>
      </div>

      {/* Redeem Button */}
      <button
        onClick={() => onRedeem(item.id)}
        disabled={!canAfford || !inStock}
        className={`w-full py-2 rounded-lg text-white font-medium transition-colors ${
          !inStock || !canAfford
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
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
