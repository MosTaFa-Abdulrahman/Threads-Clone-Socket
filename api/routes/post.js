const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { protectedRoute } = require("../utils/protectedRoute");

// Create
router.post("/create", protectedRoute, async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "Postedby and text fields are required 😎" });
    }

    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found 😥" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post 😥" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters 🤗` });
    }

    const newPost = new Post({ postedBy, text, img });
    await newPost.save();

    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get (ID)
router.get("/get/:id", async (req, res) => {
  try {
    const findPost = await Post.findById(req.params.id);
    if (!findPost) return res.status(404).json({ error: "Post Not Found 😔" });
    res.status(200).json(findPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
router.delete("/delete/:id", protectedRoute, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post Deleted Successful 🥰" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/DisLike
router.put("/like/:id", protectedRoute, async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found 😣" });

    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      // DisLike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post DisLiked Successfully 😀" });
    } else {
      // Like
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post Liked Successfully 😍" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Posts for (((Special User)))
router.get("/profile/:username", protectedRoute, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: "User Not Found 😥" });
    }
    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Feed Posts (Friend Posts)
router.get("/feed", protectedRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User Not Found 😥" });
    }

    const followings = user.followings;
    const feedPosts = await Post.find({
      postedBy: { $in: followings },
    }).sort({ createdAt: -1 });
    res.status(200).json(feedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reply To Post ((ADD Comment))
router.put("/reply/:id", protectedRoute, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text field is required 😗" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found 😥" });
    }

    const reply = { userId, text, userProfilePic, username };
    post.replies.push(reply);
    await post.save();
    res.status(200).json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//((Delete Comment))
router.delete("/:postId/replies/:replyId", protectedRoute, async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json("Post not found 😥");
    }

    const replyIndex = post.replies.findIndex(
      (reply) => reply._id.toString() === replyId
    );
    const replyUserId = post.replies.findIndex(
      (reply) => reply.userId.toString() === userId
    );

    // Check if the reply exists
    if (replyIndex === -1) {
      return res.status(404).json({ error: "Reply not found" });
    }

    if (replyUserId) {
      // Remove the reply from the replies array
      post.replies.splice(replyIndex, 1);

      await post.save();

      res.status(200).json("Reply deleted successfully 😙");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
