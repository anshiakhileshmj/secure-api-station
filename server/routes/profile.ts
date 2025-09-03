import express from 'express';
import { db } from '../db';
import { developerProfiles } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId;
    
    const profile = await db
      .select()
      .from(developerProfiles)
      .where(eq(developerProfiles.userId, userId))
      .limit(1);

    if (profile.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile: profile[0] });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { companyName, website, apiUsagePlan } = req.body;

    const updatedProfile = await db
      .update(developerProfiles)
      .set({
        companyName,
        website,
        apiUsagePlan,
        updatedAt: new Date()
      })
      .where(eq(developerProfiles.userId, userId))
      .returning();

    if (updatedProfile.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ 
      message: 'Profile updated successfully',
      profile: updatedProfile[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;