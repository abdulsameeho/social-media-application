const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const { ObjectId } = require("mongodb");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/profile/:id",requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const otherPost = await Post.find({ postedBy: id }).populate("postedBy");
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const followersCount = user.followers.length;
    const followingCount = user.following.length;

    res.json({ user, otherPost, followersCount, followingCount });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/follow", requireLogin, async (req, res) => {
  try {
    const followId = req.body.followId;

    const followedUser = await User.findByIdAndUpdate(
      followId,
      {
        $addToSet: { followers: req.user._id },  
      },
      { new: true }
    );


    const currentUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { following: followId },
      },
      { new: true }
    );

    res.json(currentUser);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});



router.put("/unfollow", requireLogin, async (req, res) => {
  try {
    const unfollowId = req.body.unfollowId;

    const unfollowedUser = await User.findByIdAndUpdate(
      unfollowId,
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    );


    const currentUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: unfollowId },
      },
      { new: true }
    );

    res.json(currentUser);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});


router.put("/updatepic", requireLogin, async (req, res) => {
  try {
    // Check if the uploaded file is of type JPG or PNG
    if (
      req.body.pic &&
      (req.body.pic.endsWith(".jpg") ||
        req.body.pic.endsWith(".png") ||
        req.body.pic.endsWith(".webp"))
    ) {
      const result = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { pic: req.body.pic } },
        { new: true }
      );
      res.json(result);
    } else {
      throw new Error("Invalid file type. Only JPG and PNG files are allowed.");
    }
  } catch (err) {
    res
      .status(422)
      .json({ error: "Pic cannot be updated", message: err.message });
  }
});



router.get("/followingusers/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("following", "name");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const followingUsers = user.following.map((followingUser) => ({
      _id: followingUser._id,
      name: followingUser.name,
    }));
    res.json({ followingUsers });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/followerusers/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("followers", "name");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const followerUsers = user.followers.map((followerUser) => ({
      _id: followerUser._id,
      name: followerUser.name,
    }));
    res.json({ followerUsers });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
