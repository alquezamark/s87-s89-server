const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// Add Comment
router.post('/:postId', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        const newComment = new Comment({
            content: req.body.content,
            author: req.user.id,
            post: req.params.postId
        });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Comments for a Post
router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Comment (Admin Only)
router.delete('/:commentId', auth, adminAuth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        
        await comment.remove();
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;