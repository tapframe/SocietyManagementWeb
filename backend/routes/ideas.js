import express from 'express';
import Idea from '../models/Idea.js';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find()
      .sort({ createdAt: -1 }) // Most recent first
      .populate('createdBy', 'name email')
      .exec();
    
    res.json(ideas);
  } catch (err) {
    console.error('Error fetching ideas:', err);
    res.status(500).json({ message: 'Failed to fetch ideas' });
  }
});

// Get a specific idea
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('comments.createdBy', 'name email')
      .exec();
      
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    res.json(idea);
  } catch (err) {
    console.error('Error fetching idea:', err);
    
    // Check if the error is due to invalid ID format
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid idea ID' });
    }
    
    res.status(500).json({ message: 'Failed to fetch idea' });
  }
});

// Create a new idea (requires authentication)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const idea = new Idea({
      title,
      description,
      category,
      createdBy: req.user.id
    });
    
    const savedIdea = await idea.save();
    
    // Populate the user details for the response
    await savedIdea.populate('createdBy', 'name email');
    
    res.status(201).json(savedIdea);
  } catch (err) {
    console.error('Error creating idea:', err);
    res.status(500).json({ message: 'Failed to create idea' });
  }
});

// Upvote an idea (requires authentication)
router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    // Check if user has already upvoted
    if (idea.upvotes.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already upvoted this idea' });
    }
    
    // Add upvote
    idea.upvotes.push(req.user.id);
    await idea.save();
    
    res.json({ 
      message: 'Upvote added successfully',
      upvotes: idea.upvotes.length
    });
  } catch (err) {
    console.error('Error upvoting idea:', err);
    
    // Check if the error is due to invalid ID format
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid idea ID' });
    }
    
    res.status(500).json({ message: 'Failed to upvote idea' });
  }
});

// Add a comment to an idea (requires authentication)
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    // Add comment
    idea.comments.push({
      text,
      createdBy: req.user.id
    });
    
    await idea.save();
    
    // Populate the newly added comment's user details
    await idea.populate('comments.createdBy', 'name email');
    
    res.status(201).json({
      message: 'Comment added successfully',
      comments: idea.comments
    });
  } catch (err) {
    console.error('Error adding comment:', err);
    
    // Check if the error is due to invalid ID format
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid idea ID' });
    }
    
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// Get all ideas by a specific user (requires authentication)
router.get('/user/me', auth, async (req, res) => {
  try {
    const ideas = await Idea.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .exec();
    
    res.json(ideas);
  } catch (err) {
    console.error('Error fetching user ideas:', err);
    res.status(500).json({ message: 'Failed to fetch user ideas' });
  }
});

export default router; 