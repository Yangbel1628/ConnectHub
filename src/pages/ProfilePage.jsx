import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import  PostCard  from '../components/Post/PostCard';
import { User, Award, Calendar, MapPin } from 'lucide-react';

export function ProfilePage() {
  const { profile, user } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user's posts safely inside useEffect
  useEffect(() => {
    if (!user) return;

    const loadUserPosts = () => {
      const postsData = JSON.parse(localStorage.getItem('posts')) || [];
      const filtered = postsData
        .filter((p) => p.user_id === user.id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setUserPosts(filtered);
      setLoading(false);
    };

    loadUserPosts();
  }, [user]);

  const handleLike = (postId) => {
    if (!user) return;

    const likes = JSON.parse(localStorage.getItem('post_likes')) || [];
    const existingLike = likes.find(
      (l) => l.post_id === postId && l.user_id === user.id
    );

    let updatedLikes;
    if (existingLike) {
      // Remove like
      updatedLikes = likes.filter((l) => l.id !== existingLike.id);
    } else {
      // Add like
      const newLike = {
        id: Date.now().toString(),
        post_id: postId,
        user_id: user.id,
      };
      updatedLikes = [...likes, newLike];
    }

    localStorage.setItem('post_likes', JSON.stringify(updatedLikes));

    // Update likes_count in posts
    const postsData = JSON.parse(localStorage.getItem('posts')) || [];
    const updatedPosts = postsData.map((p) => {
      if (p.id === postId) {
        const count = updatedLikes.filter((l) => l.post_id === postId).length;
        return { ...p, likes_count: count };
      }
      return p;
    });
    localStorage.setItem('posts', JSON.stringify(updatedPosts));

    // Refresh user's posts
    const refreshedPosts = updatedPosts
      .filter((p) => p.user_id === user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setUserPosts(refreshedPosts);
  };

  const handleComment = (postId) => {
    console.log('Comment on post:', postId);
    // Optional: comments can also be stored in localStorage
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
            {profile?.full_name?.[0] || 'U'}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile?.full_name}</h1>
            <p className="text-gray-600 mb-4">{profile?.email}</p>

            {profile?.bio && <p className="text-gray-700 mb-4">{profile.bio}</p>}

            <div className="flex flex-wrap gap-4">
              {profile?.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-2" />
                  <span>{profile.location}</span>
                </div>
              )}

              <div className="flex items-center text-gray-600">
                <Award size={18} className="mr-2 text-yellow-500" />
                <span className="font-semibold">{profile?.reward_points || 0} points</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-2" />
                <span>
                  Joined{' '}
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'}
                </span>
              </div>
            </div>

            {profile?.interests && profile.interests.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Posts</h2>
        {userPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No posts yet</p>
          </div>
        ) : (
          userPosts.map((post) => (
            <PostCard
              key={post.id}
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
export default ProfilePage