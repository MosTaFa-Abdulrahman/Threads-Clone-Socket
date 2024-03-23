const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");
const { protectedRoute } = require("../utils/protectedRoute");
const Post = require("../models/Post");

// Get By ((QUERY))
router.get("/get/:query", async (req, res) => {
  const { query } = req.params;
  try {
    let user;

    // query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      // query is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get By (Username)
router.get("/find/:username", async (req, res) => {
  try {
    const getUser = await User.findOne({ username: req.params.username });
    if (getUser) return res.status(200).json(getUser);
    else res.status(400).json({ error: "User Not Found 😣" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put("/update/:id", protectedRoute, async (req, res) => {
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found 😥" });

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    // Find all posts that this user replied and update username and userProfilePic fields
    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow/UnFollow
router.post("/follow/:id", protectedRoute, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = await User.findById(req.user._id);
    const anotherUser = await User.findById(id);

    if (id === req.user._d) {
      return res
        .status(400)
        .json({ error: "You cannot Follow/UnFollow Yourself 😉" });
    }

    if (!currentUser || !anotherUser) {
      return res.status(400).json({ error: "User not found 😣" });
    }

    const isFollowing = currentUser.followings.includes(id);
    if (isFollowing) {
      // UnFollow
      await User.findByIdAndUpdate(req.user._id, { $pull: { followings: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "User UnFollowed Successfully 😎" });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.user._id, { $push: { followings: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      res.status(200).json({ message: "User Followed Successfully 💘" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Suggested Users ((Focus 🧠))
router.get("/suggested/get", protectedRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByYou = await User.findById(userId).select("followings");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.followings.includes(user._id)
    );

    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json("Error Get Suggested Users !😥");
  }
});

module.exports = router;
