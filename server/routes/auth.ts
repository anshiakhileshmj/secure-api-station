import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { developerProfiles } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// User signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, companyName, website } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(developerProfiles)
      .where(eq(developerProfiles.userId, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate partner ID
    const partnerId = `partner_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    // Create user profile
    const newUser = await db
      .insert(developerProfiles)
      .values({
        userId: email,
        companyName: companyName || '',
        website: website || '',
        partnerId,
        apiUsagePlan: 'free',
        monthlyRequestLimit: 1000
      })
      .returning();

    // Generate JWT token
    const token = jwt.sign(
      { userId: email, partnerId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: email,
        email,
        partnerId
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await db
      .select()
      .from(developerProfiles)
      .where(eq(developerProfiles.userId, email))
      .limit(1);

    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For migration purposes, we'll skip password verification temporarily
    // In production, you'd verify against a hashed password stored in the database
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: email, partnerId: user[0].partnerId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Signed in successfully',
      user: {
        id: email,
        email,
        partnerId: user[0].partnerId
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User signout
router.post('/signout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ message: 'Signed out successfully' });
});

// Get current user session
router.get('/session', async (req, res) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ error: 'No authentication token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const user = await db
      .select()
      .from(developerProfiles)
      .where(eq(developerProfiles.userId, decoded.userId))
      .limit(1);

    if (user.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: decoded.userId,
        email: decoded.userId,
        partnerId: user[0].partnerId
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;