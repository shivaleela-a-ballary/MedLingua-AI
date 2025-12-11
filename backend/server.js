import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory user storage (replace with database in production)
const users = [];

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ============================================
// AUTH ROUTES
// ============================================

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      age: null,
      language: 'English',
      createdAt: new Date()
    };

    users.push(user);

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
});

// Update user preferences
app.put('/api/auth/preferences', authenticateToken, (req, res) => {
  try {
    const { age, language } = req.body;
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (age) user.age = age;
    if (language) user.language = language;

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences', details: error.message });
  }
});

// ============================================
// EXISTING ROUTES
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MedLingua AI Backend is running!' });
});

app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { message, age, language, imageBase64 } = req.body;
    if (!message && !imageBase64) {
      return res.status(400).json({ error: 'Message or image is required' });
    }

    const systemPrompt = `You are MedLingua AI, a compassionate multilingual healthcare assistant. Respond in ${language}. User age: ${age} years. Provide accurate medical information, simplify complex terms, and include preventive suggestions. You provide general health information only, not professional medical advice.`;

    let result;
    if (imageBase64) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      const imageParts = [{ inlineData: { data: imageBase64.split(',')[1] || imageBase64, mimeType: 'image/jpeg' }}];
      const prompt = systemPrompt + '\n\n' + (message || 'Analyze this medical image.');
      result = await model.generateContent([prompt, ...imageParts]);
    } else {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp', systemInstruction: systemPrompt });
      result = await model.generateContent(message);
    }

    const response = await result.response;
    res.json({ reply: response.text(), timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 MedLingua AI Backend running on http://localhost:${PORT}`);
  console.log(`📝 Authentication endpoints available`);
});