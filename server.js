const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Load/Save JSON Data
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { users: {}, ledgers: {} };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Auth Middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ============ AUTH ENDPOINTS ============

app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  const data = loadData();

  if (!username || !password || username.length < 3) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  if (data.users[username]) {
    return res.status(400).json({ error: 'User exists' });
  }

  data.users[username] = { password }; // In production, hash the password!
  data.ledgers[username] = {
    isSetup: false,
    baseBalance: 0,
    defaultRate: 20,
    shifts: [],
    expenses: []
  };
  saveData(data);

  const token = jwt.sign({ userId: username }, SECRET_KEY, { expiresIn: '30d' });
  res.json({ token, username });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const data = loadData();

  const user = data.users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: username }, SECRET_KEY, { expiresIn: '30d' });
  res.json({ token, username });
});

// ============ SETUP ENDPOINT ============

app.post('/api/setup', verifyToken, (req, res) => {
  const { baseBalance, defaultRate } = req.body;
  const data = loadData();

  if (!data.ledgers[req.userId]) {
    data.ledgers[req.userId] = {
      isSetup: false,
      baseBalance: 0,
      defaultRate: 20,
      shifts: [],
      expenses: []
    };
  }

  data.ledgers[req.userId].baseBalance = parseFloat(baseBalance) || 0;
  data.ledgers[req.userId].defaultRate = parseFloat(defaultRate) || 20;
  data.ledgers[req.userId].isSetup = true;
  saveData(data);

  res.json({ success: true, ledger: data.ledgers[req.userId] });
});

// ============ GET LEDGER ============

app.get('/api/ledger', verifyToken, (req, res) => {
  const data = loadData();
  const ledger = data.ledgers[req.userId];

  if (!ledger) {
    return res.status(404).json({ error: 'Ledger not found' });
  }

  res.json(ledger);
});

// ============ SHIFT ENDPOINTS ============

app.post('/api/shifts', verifyToken, (req, res) => {
  const { rate } = req.body;
  const data = loadData();
  const ledger = data.ledgers[req.userId];

  if (!ledger) return res.status(404).json({ error: 'Ledger not found' });

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
  saveData(data);

  res.json(shift);
});

app.put('/api/shifts/:id', verifyToken, (req, res) => {
  const { rate, paid } = req.body;
  const data = loadData();
  const ledger = data.ledgers[req.userId];

  if (!ledger) return res.status(404).json({ error: 'Ledger not found' });

  const shift = ledger.shifts.find(s => s.id === parseInt(req.params.id));
  if (!shift) return res.status(404).json({ error: 'Shift not found' });

  if (rate !== undefined) shift.rate = parseFloat(rate);
  if (paid !== undefined) shift.paid = paid;

  saveData(data);
  res.json(shift);
});

app.delete('/api/shifts/:id', verifyToken, (req, res) => {
  const data = loadData();
  const ledger = data.ledgers[req.userId];

  if (!ledger) return res.status(404).json({ error: 'Ledger not found' });

  ledger.shifts = ledger.shifts.filter(s => s.id !== parseInt(req.params.id));
  saveData(data);

  res.json({ success: true });
});

// ============ EXPENSE ENDPOINTS ============

app.post('/api/expenses', verifyToken, (req, res) => {
  const { amount, description } = req.body;
  const data = loadData();
  const ledger = data.ledgers[req.userId];

  if (!ledger) return res.status(404).json({ error: 'Ledger not found' });

  const expense = {
    id: Date.now(),
    amount: parseFloat(amount),
    description,
    date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
  };

  ledger.expenses.unshift(expense);
  saveData(data);

  res.json(expense);
});

app.delete('/api/expenses/:id', verifyToken, (req, res) => {
  const data = loadData();
  const ledger = data.ledgers[req.userId];

  if (!ledger) return res.status(404).json({ error: 'Ledger not found' });

  ledger.expenses = ledger.expenses.filter(e => e.id !== parseInt(req.params.id));
  saveData(data);

  res.json({ success: true });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✨ FinanceFlow API running on port ${PORT}`);
});