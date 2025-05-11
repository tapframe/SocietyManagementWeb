import express from 'express';
import Petition from '../models/Petition.js';
import { authenticateToken } from './auth.js';
import { isAdmin } from './admin.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Route to get petitions created by the currently authenticated user
router.get('/user', authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const petitions = await Petition.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .select('-signatures.user.email'); 
    res.json(petitions);
  } catch (error) {
    console.error("Error in /petitions/user route:", error);
    res.status(500).json({ message: 'Server error fetching user petitions', error: error.message });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads', 'petitions');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with original extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `petition-image-${uniqueSuffix}${ext}`);
  }
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  // Accept only images
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Get all petitions
router.get('/', async (req, res) => {
  try {
    const petitions = await Petition.find({
      $or: [
        { 'adminReview.status': 'approved' },
        { 'adminReview.status': 'pending' } 
      ]
    })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .select('-signatures.user.email'); // Don't expose signer emails
    
    res.json(petitions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific petition by ID
router.get('/:id', async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('signatures.user', 'name')
      .populate('adminReview.reviewedBy', 'name');
    
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    
    res.json(petition);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new petition (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, goal, deadline } = req.body;
    
    // Validate deadline is in the future
    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      return res.status(400).json({ message: 'Deadline must be in the future' });
    }
    
    const newPetition = new Petition({
      title,
      description,
      category,
      goal: parseInt(goal, 10) || 100,
      deadline: deadlineDate,
      createdBy: req.user.id
    });
    
    const savedPetition = await newPetition.save();
    res.status(201).json(savedPetition);
  } catch (error) {
    res.status(400).json({ message: 'Error creating petition', error: error.message });
  }
});

// Upload image for a petition
router.post('/:id/image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    const petition = await Petition.findById(req.params.id);
    
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    
    // Check if user has permission
    if (petition.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to modify this petition' });
    }
    
    // Save the file path to the petition
    petition.image = `/uploads/petitions/${req.file.filename}`;
    await petition.save();
    
    res.json({ message: 'Image uploaded successfully', file: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a petition (only by creator or admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    
    // Check if user has permission to edit
    if (petition.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to edit this petition' });
    }
    
    // Only allow edits to non-completed petitions
    if (['completed', 'expired', 'rejected'].includes(petition.status)) {
      return res.status(400).json({ message: `Cannot edit a petition with status: ${petition.status}` });
    }
    
    const { title, description, category, goal, deadline } = req.body;
    
    // Update basic fields
    if (title) petition.title = title;
    if (description) petition.description = description;
    if (category) petition.category = category;
    if (goal) petition.goal = parseInt(goal, 10);
    if (deadline) {
      const deadlineDate = new Date(deadline);
      if (deadlineDate <= new Date()) {
        return res.status(400).json({ message: 'Deadline must be in the future' });
      }
      petition.deadline = deadlineDate;
    }
    
    await petition.save();
    res.json(petition);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a signature to a petition
router.post('/:id/sign', authenticateToken, async (req, res) => {
  try {
    const { comment } = req.body;
    console.log('Sign petition request received for petition ID:', req.params.id);
    console.log('User from token:', req.user);

    const petition = await Petition.findById(req.params.id);
    
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    
    // Check if petition is active
    if (petition.status !== 'active') {
      return res.status(400).json({ message: `Cannot sign a petition with status: ${petition.status}` });
    }
    
    // Check if petition is approved
    if (petition.adminReview.status !== 'approved') {
      return res.status(400).json({ message: 'Cannot sign a petition that has not been approved' });
    }
    
    // Check if user has already signed
    if (petition.hasUserSigned(req.user.id)) {
      return res.status(400).json({ message: 'You have already signed this petition' });
    }
    
    // Fetch user's name from database if not in token
    let userName = req.user.name;
    if (!userName) {
      console.log('Name not found in token, attempting to fetch from database');
      try {
        const userFromDb = await import('../models/User.js').then(module => module.default.findById(req.user.id).select('name'));
        if (userFromDb && userFromDb.name) {
          userName = userFromDb.name;
          console.log('Successfully fetched name from database:', userName);
        } else {
          userName = 'Anonymous Supporter';
          console.log('User not found in database, using fallback name');
        }
      } catch (userError) {
        console.error('Error fetching user from database:', userError);
        userName = 'Anonymous Supporter';
      }
    }
    
    console.log('Adding signature with name:', userName);
    
    // Add signature
    petition.signatures.push({
      user: req.user.id,
      name: userName, // Using name from token or fallback
      comment,
      timestamp: new Date()
    });
    
    // Check if goal has been reached
    if (petition.signatures.length >= petition.goal) {
      petition.status = 'completed';
    }
    
    await petition.save();
    console.log('Petition signed successfully');
    res.status(201).json({ message: 'Signature added successfully', signatureCount: petition.signatures.length });
  } catch (error) {
    console.error('ERROR SIGNING PETITION:', error);
    console.error('Petition ID:', req.params.id);
    console.error('User ID:', req.user?.id);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add an update to a petition (creator only)
router.post('/:id/updates', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const petition = await Petition.findById(req.params.id);
    
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    
    // Check if user is the creator
    if (petition.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the petition creator can add updates' });
    }
    
    petition.updates.push({
      text,
      addedBy: req.user.id,
      addedAt: new Date()
    });
    
    await petition.save();
    res.status(201).json(petition.updates[petition.updates.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes

// Get all petitions for admin review
router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const petitions = await Petition.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    
    res.json(petitions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Review a petition (admin only)
router.put('/admin/:id/review', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid review status' });
    }
    
    const petition = await Petition.findById(req.params.id);
    
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    
    petition.adminReview = {
      status,
      notes,
      reviewedBy: req.user.id,
      reviewedAt: new Date()
    };
    
    // If petition is rejected, update its status
    if (status === 'rejected') {
      petition.status = 'rejected';
    }
    
    await petition.save();
    
    res.json(petition);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper route to check petition deadlines and update status
router.post('/check-deadlines', async (req, res) => {
  try {
    const now = new Date();
    
    // Find active petitions with passed deadlines
    const expiredPetitions = await Petition.updateMany(
      { 
        status: 'active',
        deadline: { $lt: now }
      },
      { 
        $set: { status: 'expired' }
      }
    );
    
    res.json({ 
      message: 'Checked for expired petitions',
      updated: expiredPetitions.nModified
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a petition (only by creator)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    // Check if user is the creator
    if (petition.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to delete this petition' });
    }

    // Path to the image file, if it exists
    const imagePath = petition.image ? path.join(process.cwd(), petition.image) : null;

    // Delete the petition from the database
    await Petition.findByIdAndDelete(req.params.id);

    // If an image exists, delete it from the filesystem
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          // Log the error but don't make the request fail because the petition is already deleted
          console.error('Failed to delete petition image:', err);
        }
      });
    }

    res.json({ message: 'Petition deleted successfully' });
  } catch (error) {
    console.error('Error deleting petition:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router; 