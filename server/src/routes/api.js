import { Router } from 'express';
import { askAI } from '../controllers/aiController.js';

const router = Router();

// Health check route to verify backend connectivity
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'WebXR API backend is running cleanly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// AI assistant route — receives question + simulation context, proxies to Gemini
router.post('/ai/ask', askAI);

export default router;
