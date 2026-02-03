import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/Post/PostCard";
import { PlusCircle } from "lucide-react";
import { setCurrentPage } from "./navigation";

export function HomePage() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts
  useEffect(() => {
    if (!token) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPosts(Array.isArray(data)
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  // Like post
  const handleLike = async (postId) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = await res.json();
      setPosts(prev =>
        prev.map(p => p._id === postId ? { ...p, likes_count: updated.likes_count } : p)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Add comment
  const handleComment = async (postId, text) => {
    if (!token || !text.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const newComment = await res.json();

      // Update post in state with new comment
      setPosts(prev =>
        prev.map(p =>
          p._id === postId
            ? { ...p, comments: [...(p.comments || []), newComment] }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-6">Loading posts...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Create post box */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <button
            onClick={() => setCurrentPage("create-post")}
            className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
          >
            What's on your mind?
          </button>
          <button
            onClick={() => setCurrentPage("create-post")}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 active:scale-95 transition-all duration-150"
          >
            <PlusCircle size={24} />
          </button>
        </div>
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No posts yet.</p>
        </div>
      ) : (
        posts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            onLike={handleLike}
            onComment={handleComment} // unified comment handler
          />
        ))
      )}
    </div>
  );
}

export default HomePage;
