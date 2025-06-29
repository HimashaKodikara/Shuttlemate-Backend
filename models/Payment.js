import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    trim: true
  },
  itemId: {
    type: String,
    required: [true, 'Item ID is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive'],
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: 'Amount must be greater than 0'
    }
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    uppercase: true,
    trim: true,
    minlength: [3, 'Currency code must be 3 characters'],
    maxlength: [3, 'Currency code must be 3 characters'],
    default: 'USD'
  },
  // Change this field name to match your database
  PaymentID: {  // Changed from paymentIntentId to PaymentID
    type: String,
    required: [true, 'Payment Intent ID is required'],
    unique: true,
    trim: true,
    index: true
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['pending', 'succeeded', 'failed', 'canceled', 'refunded'],
      message: '{VALUE} is not a valid payment status'
    },
    default: 'pending'
  },
  metadata: {
    type: Map,
    of: String,
    default: new Map()
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update indexes
PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: -1 });

// Add virtual for backward compatibility if needed
PaymentSchema.virtual('paymentIntentId').get(function() {
  return this.PaymentID;
});

PaymentSchema.virtual('paymentIntentId').set(function(value) {
  this.PaymentID = value;
});

PaymentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount);
});

PaymentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

PaymentSchema.statics.findByUser = function(userId, options = {}) {
  const { limit = 10, skip = 0, status } = options;
  
  let query = this.find({ userId });
  
  if (status) {
    query = query.where({ status });
  }
  
  return query
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

PaymentSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);
};

PaymentSchema.methods.markAsFailed = function() {
  this.status = 'failed';
  this.updatedAt = new Date();
  return this.save();
};

PaymentSchema.methods.markAsSucceeded = function() {
  this.status = 'succeeded';
  this.updatedAt = new Date();
  return this.save();
};

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;