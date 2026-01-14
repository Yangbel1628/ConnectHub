import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from './navigation';
import { Image, Video, Send } from 'lucide-react';

export function CreatePostPage() {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [loading, setLoading] = useState(false);

  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setLoading(true);

    // Get existing posts from localStorage
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Create new post object
    const newPost = {
      id: Date.now().toString(),
      user_id: user.id,
      content: content.trim(),
      media_url: mediaUrl || null,
      media_type: mediaType,
      created_at: new Date().toISOString(),
    };

    // Save back to localStorage
    posts.unshift(newPost); // add to beginning
    localStorage.setItem('posts', JSON.stringify(posts));

    // Update user reward points
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? { ...u, reward_points: (u.reward_points || 0) + 10 }
        : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Refresh profile if needed
    if (refreshProfile) refreshProfile();

    // Reset form and navigate home
    setContent('');
    setMediaUrl('');
    setMediaType(null);
    setLoading(false);
    navigate('home');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's on your mind?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Share your thoughts..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media URL (optional)
            </label>
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {mediaUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media Type
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    mediaType === 'image'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Image size={20} />
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    mediaType === 'video'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Video size={20} />
                  Video
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Send size={20} />
              {loading ? 'Posting...' : 'Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('home')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Earn 10 reward points for creating a post!
        </p>
      </div>
    </div>
  );
}

export default CreatePostPage
