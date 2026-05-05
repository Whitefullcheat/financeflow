require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const User = require('./User');
const Ledger = require('./Ledger');

const app = express();
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ============ AUTH MIDDLEWARE ============

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ============ AUTH ENDPOINTS ============

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password || username.length < 3) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User exists' });
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = new User({ username, password });
    await user.save();

    // Create ledger for user
    const ledger = new Ledger({
      userId: user._id,
      username: user.username,
      isSetup: false,
      baseBalance: 0,
      defaultRate: 20,
      shifts: [],
      expenses: []
    });
    await ledger.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      SECRET_KEY,
      { expiresIn: '30d' }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      SECRET_KEY,
      { expiresIn: '30d' }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============ SETUP ENDPOINT ============

app.post('/api/setup', verifyToken, async (req, res) => {
  try {
    const { baseBalance, defaultRate } = req.body;

    let ledger = await Ledger.findOne({ userId: req.userId });
    if (!ledger) {
      ledger = new Ledger({
        userId: req.userId,
        username: req.username,
        isSetup: false,
        baseBalance: 0,
        defaultRate: 20,
        shifts: [],
        expenses: []
      });
    }

    ledger.baseBalance = parseFloat(baseBalance) || 0;
    ledger.defaultRate = parseFloat(defaultRate) || 20;
    ledger.isSetup = true;

    await ledger.save();

    res.json({ success: true, ledger });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ error: 'Setup failed' });
  }
});

// ============ GET LEDGER ============

app.get('/api/ledger', verifyToken, async (req, res) => {
  try {
    const ledger = await Ledger.findOne({ userId: req.userId });

    if (!ledger) {
      return res.status(404).json({ error: 'Ledger not found' });
    }

    res.json(ledger);
  } catch (error) {
    console.error('Get ledger error:', error);
    res.status(500).json({ error: 'Failed to fetch ledger' });
  }
});

// ============ SHIFT ENDPOINTS ============

app.post('/api/shifts', verifyToken, async (req, res) => {
  try {
    const { rate } = req.body;

    const ledger = await Ledger.findOne({ userId: req.userId });
    if (!ledger) {
      return res.status(404).json({ error: 'Ledger not found' });
    }

    const now = new Date();
    const dateStr = now.getDate().toString().padStart(2, '0') + '/' +
                    (now.getMonth() + 1).toString().padStart(2, '0');

    const shift = {
      id: Date.now(),
      date: dateStr,
      rate: parseFloat(rate) || ledger.defaultRate,
      paid: false
    };

    ledger.shifts.unshift(shift);
    await ledger.save();

    res.json(shift);
  } catch (error) {
    console.error('Create shift error:', error);
    res.status(500).json({ error: 'Failed to create shift' });
  }
});

app.put('/api/shifts/:id', verifyToken, async (req, res) => {
  try {
    const { rate, paid } = req.body;

    const ledger = await Ledger.findOne({ userId: req.userId });
    if (!ledger) {
      return res.status(404).json({ error: 'Ledger not found' });
    }

    const shift = ledger.shifts.find(s => s.id === parseInt(req.params.id));
    if (!shift) {
      return res.status(404).json({ error: 'Shift not found' });
    }

    if (rate !== undefined) shift.rate = parseFloat(rate);
    if (paid !== undefined) shift.paid = paid;

    await ledger.save();
    res.json(shift);
  } catch (error) {
    console.error('Update shift error:', error);
    res.status(500).json({ error: 'Failed to update shift' });
  }
});

app.delete('/api/shifts/:id', verifyToken, async (req, res) => {
  try {
    const ledger = await Ledger.findOne({ userId: req.userId });
    if (!ledger) {
      return res.status(404).json({ error: 'Ledger not found' });
    }

    ledger.shifts = ledger.shifts.filter(s => s.id !== parseInt(req.params.id));
    await ledger.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Delete shift error:', error);
    res.status(500).json({ error: 'Failed to delete shift' });
  }
});

// ============ EXPENSE ENDPOINTS ============

app.post('/api/expenses', verifyToken, async (req, res) => {
  try {
    const { amount, description } = req.body;

    const ledger = await Ledger.findOne({ userId: req.userId });
    if (!ledger) {
      return res.status(404).json({ error: 'Ledger not found' });
    }

    const expense = {
      id: Date.now(),
      amount: parseFloat(amount),
      description,
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
    };

    ledger.expenses.unshift(expense);
    await ledger.save();

    res.json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

app.delete('/api/expenses/:id', verifyToken, async (req, res) => {
  try {
    const ledger = await Ledger.findOne({ userId: req.userId });
    if (!ledger) {
      return res.status(404).json({ error: 'Ledger not found' });
    }

    ledger.expenses = ledger.expenses.filter(e => e.id !== parseInt(req.params.id));
    await ledger.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// ============ ERROR HANDLER ============

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============ START SERVER ============

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✨ FinanceFlow API running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
