import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/Post/PostCard";
import { User, Award, Calendar, MapPin } from "lucide-react";

export function ProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) return;

    const fetchProfileAndPosts = async () => {
      try {
        // Profile
        const resProfile = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resProfile.ok) throw new Error("Failed to fetch profile");
        const dataProfile = await resProfile.json();

        // Posts
        const resPosts = await fetch(
          `http://localhost:5000/api/posts?userId=${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!resPosts.ok) throw new Error("Failed to fetch posts");
        const dataPosts = await resPosts.json();

        setProfile(dataProfile);
        setUserPosts(
          dataPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [user, token]);

  const handleLike = async (postId) => {
    if (!user || !token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to like post");

      setUserPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = (postId) => {
    console.log("Comment on post:", postId);
  };

  if (loading)
    return <div className="text-center p-6">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6 flex gap-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
          {profile?.fullName?.[0] || "U"}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{profile?.fullName || "-"}</h1>
          <p>{profile?.email || "-"}</p>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center text-gray-600">
              <MapPin size={18} className="mr-2" />
              {profile?.location || "-"}
            </div>
            <div className="flex items-center text-gray-600">
              <Award size={18} className="mr-2 text-yellow-500" />
              {profile?.reward_points || 0} points
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar size={18} className="mr-2" />
              Joined{" "}
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Posts</h2>
        {userPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <p>No posts yet</p>
          </div>
        ) : (
          userPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
