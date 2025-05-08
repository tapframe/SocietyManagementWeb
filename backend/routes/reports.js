import express from 'express';
import Report from '../models/Report.js';
import { authenticateToken } from './auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { isAdmin } from './admin.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with original extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `report-evidence-${uniqueSuffix}${ext}`);
  }
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  // Accept images, videos, and documents
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'video/mp4', 'video/quicktime',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, and documents are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

// Get all reports (admins can see all, citizens can only see their own)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let reports;
    if (req.user.role === 'admin') {
      // Admins can see all reports
      reports = await Report.find()
        .populate('submittedBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Citizens can only see their own reports
      reports = await Report.find({ submittedBy: req.user.id })
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    }
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific report by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name role');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if user has permission to view this report
    if (req.user.role !== 'admin' && report.submittedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to view this report' });
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new report
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, type, category, location, date, time } = req.body;
    
    const newReport = new Report({
      title,
      description,
      type,
      category,
      location,
      date,
      time,
      submittedBy: req.user.id
    });
    
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: 'Error submitting report', error: error.message });
  }
});

// Update report status (admin only)
router.patch('/:id/status', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'in-progress', 'resolved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    report.status = status;
    await report.save();
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign report to an admin
router.patch('/:id/assign', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const { adminId } = req.body;
    
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    report.assignedTo = adminId;
    await report.save();
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a comment to a report
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if user has permission to comment on this report
    if (req.user.role !== 'admin' && report.submittedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to comment on this report' });
    }
    
    const newComment = {
      text,
      user: req.user.id
    };
    
    report.comments.push(newComment);
    await report.save();
    
    // Populate user information before sending response
    const updatedReport = await Report.findById(req.params.id)
      .populate('comments.user', 'name role');
    
    res.status(201).json(updatedReport.comments[updatedReport.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload evidence for a report
router.post('/:id/evidence', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if user has permission to add evidence to this report
    if (report.submittedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to add evidence to this report' });
    }
    
    // Save the file path to the report
    report.evidence = `/uploads/${req.file.filename}`;
    await report.save();
    
    res.json({ message: 'Evidence uploaded successfully', file: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Serve uploaded files
router.get('/evidence/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), 'uploads', req.params.filename);
  res.sendFile(filePath);
});

// Get all reports (admin only)
router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate('submittedBy', 'name email');
    
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update report status (admin only)
router.put('/admin/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, note } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Find and update the report
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    report.status = status;
    if (note) {
      report.adminNotes = report.adminNotes || [];
      report.adminNotes.push({
        text: note,
        addedBy: req.user.id,
        addedAt: new Date()
      });
    }
    
    // If status is resolved or rejected, add resolution date
    if (status === 'resolved' || status === 'rejected') {
      report.resolvedAt = new Date();
    }
    
    await report.save();
    
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get report statistics (admin only)
router.get('/admin/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalCount = await Report.countDocuments();
    const pendingCount = await Report.countDocuments({ status: 'pending' });
    const resolvedCount = await Report.countDocuments({ status: 'resolved' });
    const rejectedCount = await Report.countDocuments({ status: 'rejected' });
    
    // Get reports by category
    const categories = await Report.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get recent activity
    const recentActivity = await Report.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('submittedBy', 'name email');
    
    res.status(200).json({
      total: totalCount,
      pending: pendingCount,
      approved: resolvedCount,
      rejected: rejectedCount,
      categories,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 