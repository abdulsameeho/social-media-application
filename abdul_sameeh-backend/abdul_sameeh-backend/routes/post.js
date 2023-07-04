const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const { ObjectId } = require('mongodb')
const Post = mongoose.model("Post")
const Filter = require("bad-words");
const filter = new Filter();



router.get('/allpost', requireLogin, (req, res) => {
    const currentUserID = req.user._id;
    Post.find({ postedBy: { $ne: currentUserID } })
      .populate('postedBy', '_id name')
      .populate('comments.postedBy', '_id name')
      .sort('-createdAt')
      .then((posts) => {
        res.json({ posts });
      })
      .catch((err) => {
        console.log(err);
      });
});
  
router.get('/getsubpost', requireLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
      .populate('postedBy', '_id name')
      .populate('comments.postedBy', '_id name')
      .sort('-createdAt')
      .then((posts) => {
        res.json({ posts });
      })
      .catch((err) => {
        console.log(err);
      });
});
  


router.post("/createpost", requireLogin, async (req, res) => {
  const { title, body, pic } = req.body;

  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Please add all fields" });
  }

  const fileExtension = pic.split(".").pop().toLowerCase();
  if (fileExtension === "json") {
    return res.status(422).json({ error: "JSON files cannot be uploaded" });
  }
  if (fileExtension !== "jpg" && fileExtension !== "png") {
    return res
      .status(422)
      .json({ error: "Only JPG or PNG files can be uploaded" });
  }

  req.user.password = undefined;

  // Check for profanity in the body text
  if (filter.isProfane(body)) {
    return res
      .status(422)
      .json({ error: "Content contains inappropriate language" });
  }

  try {
    // Save the post
    const post = new Post({
      body,
      title,
      photo: pic,
      postedBy: req.user,
    });

    const result = await post.save();
    res.json({ post: result });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ error: "Failed to save post" });
  }
});


router.get('/mypost',requireLogin,(req,res) =>{
     Post.find({postedBy:req.user._id})
     .populate('postedBy',"_id name")
     .then(mypost =>{
        res.json({mypost})
     })
     .catch(err =>{
        console.log(err);
     })
})


router.post(`/like`,requireLogin,(req,res) =>{
    console.log(req.body.postId);   
    console.log(req.user._id);
    Post.findByIdAndUpdate(new ObjectId(req.body.postId),{
        $push:{
            like:req.user._id
        } 
    },{
        new:true
    })
    .then((result) =>{
       return  res.json(result)
       
    }).catch(err =>{    
        return res.status(422).json({error:err})
    })
})


router.post(`/unlike`,requireLogin,(req,res) =>{
    console.log(req.body.postId);   
    console.log(req.user._id);
    Post.findByIdAndUpdate(new ObjectId(req.body.postId),{
        $pull:{
            like:req.user._id
        } 
    },{
        new:true
    })
    .then((result) =>{
       return  res.json(result)
       
    }).catch(err =>{    
        return res.status(422).json({error:err})
    })
})

router.post("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    new ObjectId(req.body.postId),
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .then((result, err) => {

      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});







module.exports = router