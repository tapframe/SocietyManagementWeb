import mongoose from 'mongoose';

const PetitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  goal: {
    type: Number,
    required: true,
    min: 10,
    default: 100
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'expired', 'rejected'],
    default: 'active'
  },
  image: {
    type: String,
    // This will store the file path or URL to an uploaded image
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  signatures: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    comment: {
      type: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  updates: [{
    text: {
      type: String,
      required: true
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  adminReview: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    notes: {
      type: String
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
PetitionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for signature count
PetitionSchema.virtual('signatureCount').get(function() {
  return this.signatures.length;
});

// Virtual for percentage of goal reached
PetitionSchema.virtual('percentageComplete').get(function() {
  return Math.min(Math.round((this.signatures.length / this.goal) * 100), 100);
});

// Check if user has signed
PetitionSchema.methods.hasUserSigned = function(userId) {
  return this.signatures.some(signature => signature.user.toString() === userId.toString());
};

const Petition = mongoose.model('Petition', PetitionSchema);

export default Petition; 