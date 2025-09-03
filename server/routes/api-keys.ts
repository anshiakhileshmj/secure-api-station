import express from 'express';
import { db } from '../db';
import { apiKeys } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth';
import crypto from 'crypto';

const router = express.Router();

// Get all API keys for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId;
    
    const keys = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId));

    // Don't return the actual key values for security
    const safeKeys = keys.map(key => ({
      ...key,
      key: undefined,
      maskedKey: key.key ? `${key.key.slice(0, 8)}...${key.key.slice(-4)}` : 'N/A'
    }));

    res.json({ apiKeys: safeKeys });
  } catch (error) {
    console.error('API keys fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new API key
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { keyName, permissions } = req.body;

    if (!keyName) {
      return res.status(400).json({ error: 'Key name is required' });
    }

    // Generate API key
    const keyValue = `aml_${crypto.randomBytes(32).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(keyValue).digest('hex');

    const newKey = await db
      .insert(apiKeys)
      .values({
        userId,
        name: keyName,
        key: keyValue,
        keyHash,
        isActive: true,
        rateLimitPerMinute: 60
      })
      .returning();

    // Return the key value only once for the user to copy
    res.status(201).json({
      message: 'API key created successfully',
      apiKey: {
        ...newKey[0],
        key: keyValue,
        maskedKey: `${keyValue.slice(0, 8)}...${keyValue.slice(-4)}`
      }
    });
  } catch (error) {
    console.error('API key creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete API key
router.delete('/:keyId', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { keyId } = req.params;

    const deletedKey = await db
      .delete(apiKeys)
      .where(and(
        eq(apiKeys.id, keyId),
        eq(apiKeys.userId, userId)
      ))
      .returning();

    if (deletedKey.length === 0) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('API key deletion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;