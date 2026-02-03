import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // make sure this points to your current AuthContext
import { useNavigate } from "react-router-dom";
import { Image, Video, Send } from "lucide-react";

export function CreatePostPage() {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, token, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Build request body
      const body = { content };
      if (mediaUrl) {
        body.mediaUrl = mediaUrl;
        body.mediaType = mediaType;
      }

      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create post");
      }

      await res.json();

      // Refresh profile if available
      if (refreshProfile) refreshProfile();

      // Clear form
      setContent("");
      setMediaUrl("");
      setMediaType(null);

      navigate("/profile"); // or navigate to home
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post content */}
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError("");
            }}
            required
            rows={6}
            className="w-full p-2 border rounded"
            placeholder="What's on your mind?"
          />

          {/* Media URL */}
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => {
              setMediaUrl(e.target.value);
              setMediaType(null);
            }}
            placeholder="Media URL (optional)"
            className="w-full p-2 border rounded"
          />

          {/* Media type selection */}
          {mediaUrl && (
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => setMediaType("image")}
                className={`px-4 py-2 rounded ${
                  mediaType === "image"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Image
              </button>
              <button
                type="button"
                onClick={() => setMediaType("video")}
                className={`px-4 py-2 rounded ${
                  mediaType === "video"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Video
              </button>
            </div>
          )}

          {/* Error */}
          {error && <p className="text-red-600">{error}</p>}

          {/* Submit button */}
          <button
            type="submit"
            disabled={
              loading || !content.trim() || (mediaUrl && !mediaType)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostPage;
