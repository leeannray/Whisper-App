//express
const express = require('express');
const router = express.Router();

//mongo db connection
const mongoose = require('mongoose');
const Post = mongoose.model("Post");

//connecting middleware for login request
const requireLogin = require('../middleware/requireLogin');

//finding all posts
//populate helping to generate only information you need to see
//posting all in json format
router.get('/allpost', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt')
        .then((posts) => {
            res.json({ posts });
        }).catch(err => {
            console.log(err);
        });
});


//readign all posts in json format
router.get('/getsubpost', requireLogin, (req, res) => {

    // if postedBy in following
    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt')
        .then(posts => {
            res.json({ posts });
        })
        .catch(err => {
            console.log(err);
        });
});


//create new post
//by adding title, body and picture
router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, pic } = req.body;
    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Plase add all the fields" })
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    });
    post.save().then(result => {
        res.json({ post: result });
    })
        .catch(err => {
            console.log(err);
        });
});


//get route to get user post in JSON format
//adding middleware to make sure user is logged in 'requireLogin'
router.get('/mypost', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("PostedBy", "_id name")
        .then(mypost => {
            res.json({ mypost });
        })
        .catch(err => {
            console.log(err);
        });
});

//Like and Unlike for post
router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        } else {
            res.json(result);
        }
    });
});
router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        } else {
            res.json(result);
        }
    });
});


//to add new comments to other post in json format
//connecting to mongoose
//adding by id and name only
router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            } else {
                res.json(result);
            }
        });
});

//to delete that post
router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err });
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        res.json(result);
                    }).catch(err => {
                        console.log(err);
                    });
            }
        });
});

module.exports = router