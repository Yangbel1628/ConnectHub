import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import RewardItemCard from "../components/Reward/RewardItemCard";
import { Award } from "lucide-react";

export function RewardsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRewards = () => {
      const rewardsData = JSON.parse(localStorage.getItem("reward_items")) || [];
      rewardsData.sort((a, b) => a.points_cost - b.points_cost);
      setItems(rewardsData);
      setLoading(false);
    };

    loadRewards();
  }, []);

  const handleRedeem = (itemId) => {
    if (!user || !profile) return;

    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (profile.reward_points < item.points_cost) {
      alert("Not enough points!");
      return;
    }

    // Deduct points and save updated profile
    const updatedProfile = {
      ...profile,
      reward_points: profile.reward_points - item.points_cost,
    };

    const storedProfiles = JSON.parse(localStorage.getItem("profiles")) || [];
    const otherProfiles = storedProfiles.filter((p) => p.id !== profile.id);
    localStorage.setItem(
      "profiles",
      JSON.stringify([...otherProfiles, updatedProfile])
    );

    if (refreshProfile) refreshProfile(updatedProfile);

    // Save redemption
    const redemptions = JSON.parse(localStorage.getItem("reward_redemptions")) || [];
    const newRedemption = {
      id: Date.now().toString(),
      user_id: user.id,
      item_id: itemId,
      points_spent: item.points_cost,
      redeemed_at: new Date().toISOString(),
    };
    localStorage.setItem(
      "reward_redemptions",
      JSON.stringify([...redemptions, newRedemption])
    );

    // Reduce stock
    const updatedItems = items.map((i) =>
      i.id === itemId ? { ...i, stock: Math.max(0, i.stock - 1) } : i
    );
    localStorage.setItem("reward_items", JSON.stringify(updatedItems));
    setItems(updatedItems);

    alert("Item redeemed successfully!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award size={32} className="text-yellow-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Reward Store</h1>
              <p className="text-gray-600">Redeem your points for amazing rewards</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Your Points</p>
            <p className="text-3xl font-bold text-blue-600">
              {profile?.reward_points || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Rewards List */}
      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No rewards available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <RewardItemCard
              key={item.id}
              item={item}
              userPoints={profile?.reward_points || 0}
              onRedeem={handleRedeem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RewardsPage;
