import { Heart, MessageCircle, Share2 } from "lucide-react";

function PostCard({ post, onLike, onComment }) {
  const userName = post.userName || "Unknown User";
  const userInitial = userName.charAt(0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      
      {/* User info */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {userInitial}
        </div>

        <div className="ml-3">
          <h3 className="font-semibold text-gray-800">{userName}</h3>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toDateString()}
          </p>
        </div>
      </div>

      {/* Post content */}
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Media */}
      {post.mediaUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {post.mediaType === "image" && (
            <img
              src={post.mediaUrl}
              alt="post"
              className="w-full"
            />
          )}

          {post.mediaType === "video" && (
            <video
              src={post.mediaUrl}
              controls
              className="w-full"
            />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t">
        <button
          onClick={() => onLike(post.id)}
          className="flex items-center gap-2 text-gray-600 hover:text-red-500"
        >
          <Heart size={18} />
          <span>{post.likes || 0}</span>
        </button>

        <button
          onClick={() => onComment(post.id)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
        >
          <MessageCircle size={18} />
          <span>{post.comments || 0}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-600 hover:text-green-500">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default PostCard;
