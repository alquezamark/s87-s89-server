// server/routes/post.js
const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Post
router.post('/', auth, async (req, res) => {
    try {
        const newPost = new Post({ ...req.body, author: req.user.id });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Single Post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Post
router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        Object.assign(post, req.body);
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || (req.user.role !== 'admin' && post.author.toString() !== req.user.id)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await post.remove();
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;