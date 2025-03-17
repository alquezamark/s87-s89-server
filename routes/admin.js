// server/routes/admin.js
const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// Admin Delete Any Post
router.delete('/posts/:id', auth, adminAuth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await Post.deleteOne({ _id: req.params.id }); // ✅ Fix: Use deleteOne()
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin Delete Any Comment
router.delete('/comments/:id', auth, adminAuth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await Comment.deleteOne({ _id: req.params.id }); // ✅ Fix: Use deleteOne()
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;