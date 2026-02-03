import { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";

function PostCard({ post, onLike, onComment, onShare }) {
  const userName = post.userName || post.fullName || "Unknown User";
  const userInitial = userName.charAt(0);
  const liked = post.liked || false;

  // Local state for comment input
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    onComment(post._id, trimmed); // pass postId and text to parent
    setCommentText(""); // clear input
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      {/* User info */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {userInitial}
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-gray-800">{userName}</h3>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Post content */}
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Media */}
      {post.mediaUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {post.mediaType === "image" && (
            <img src={post.mediaUrl} alt="post" className="w-full rounded-lg" />
          )}
          {post.mediaType === "video" && (
            <video src={post.mediaUrl} controls className="w-full rounded-lg" />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-2 transition-colors ${
            liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
          }`}
        >
          <Heart size={18} />
          <span>{post.likes_count || 0}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
          <MessageCircle size={18} />
          <span>{post.comments?.length || 0}</span>
        </button>

        <button
          onClick={() => onShare && onShare(post._id)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Comment input */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
        />
        <button
          onClick={handleCommentSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Post
        </button>
      </div>

      {/* Render comments */}
      {post.comments && post.comments.length > 0 && (
        <div className="mt-4">
          {post.comments.map((comment) => (
            <div
              key={comment._id || comment.createdAt}
              className="text-sm text-gray-700 border-t py-2"
            >
              <span className="font-semibold mr-2">
                {comment.userName || "User"}:
              </span>
              {comment.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostCard;
