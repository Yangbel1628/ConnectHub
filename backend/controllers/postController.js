const Post = require("../models/Post");
const User = require("../models/User");

/**
 * CREATE POST
 */
async function createPost(req, res) {
  try {
    const { content, mediaUrl, mediaType } = req.body;
    const userId = req.userId;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    const newPost = new Post({
      userId,
      content: content.trim(),
      mediaUrl: mediaUrl || null,
      mediaType: mediaUrl ? mediaType : null,
    });

    await newPost.save();

    const populatedPost = await Post.findById(newPost._id)
      .populate("userId", "fullName email");

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

/**
 * GET ALL POSTS
 */
async function getAllPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Get all posts error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

/**
 * GET POSTS BY USER
 */
async function getPostsByUser(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const posts = await Post.find({ userId })
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Get posts by user error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

/**
 * LIKE / UNLIKE POST  ✅ FIXED
 */
async function likePost(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.userId.toString();

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const index = post.likes.findIndex(
      (id) => id.toString() === userId
    );

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    post.likes_count = post.likes.length;
    await post.save();

    res.json({
      likes_count: post.likes_count,
      liked: index === -1,
    });
  } catch (err) {
    console.error("Like post error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

/**
 * ADD COMMENT  ✅ FIXED (no refresh needed)
 */
async function addComment(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.userId;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const user = await User.findById(userId).select("fullName");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            userId,
            userName: user.fullName, // 🔥 stored
            text: text.trim(),
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate("userId", "fullName email");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(201).json(post);
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostsByUser,
  likePost,
  addComment,
};
