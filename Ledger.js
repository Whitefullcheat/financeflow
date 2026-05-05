const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  }
});

const expenseSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

const ledgerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  isSetup: {
    type: Boolean,
    default: false
  },
  baseBalance: {
    type: Number,
    default: 0
  },
  defaultRate: {
    type: Number,
    default: 20
  },
  shifts: [shiftSchema],
  expenses: [expenseSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
ledgerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Ledger', ledgerSchema);
