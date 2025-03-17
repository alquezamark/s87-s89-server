// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const commentRoutes = require('./routes/comment');
const adminRoutes = require('./routes/admin');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);


app.use('/api/admin', adminRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));