import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/useAuth';
import  PostCard  from '../components/Post/PostCard';
import { PlusCircle } from 'lucide-react';
import { setCurrentPage } from './navigation';

export function HomePage() {
  const [postsRaw, setPostsRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Sort posts by date using useMemo
  const posts = useMemo(() => {
    return [...postsRaw].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [postsRaw]);

  // Load posts safely inside useEffect
  useEffect(() => {
    const loadPosts = () => {
      const postsData = JSON.parse(localStorage.getItem('posts')) || [];
      setPostsRaw(postsData);
      setLoading(false);
    };

    loadPosts();
  }, []);

  const handleLike = (postId) => {
    if (!user) return;

    const likes = JSON.parse(localStorage.getItem('post_likes')) || [];
    const existingLike = likes.find(
      (l) => l.post_id === postId && l.user_id === user.id
    );

    let updatedLikes;
    if (existingLike) {
      updatedLikes = likes.filter((l) => l.id !== existingLike.id);
    } else {
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
    setPostsRaw(updatedPosts);
  };

  const handleComment = (postId) => {
    console.log('Comment on post:', postId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Create post area */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <button
            onClick={() => setCurrentPage('create-post')}
            className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
          >
            What's on your mind?
          </button>
          <button
            onClick={() => setCurrentPage('create-post')}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 active:scale-95 transition-all duration-150"
          >
            <PlusCircle size={24} />
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))
      )}
    </div>
  );
}
export default HomePage
