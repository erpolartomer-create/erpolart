import express from 'express';
import { getTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate } from '../controllers/templateController.js';
import { getOrderConfig, updateOrderConfig } from '../controllers/paymentController.js';
import { protect, adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Order Configuration (requires authentication)
router.get('/order-config/:orderId', protect, getOrderConfig);
router.post('/order-config', protect, updateOrderConfig);

// Publicly available
router.get('/', getTemplates);
router.get('/:id', getTemplateById);

// Admin Only
router.post('/', adminProtect, createTemplate);
router.put('/:id', adminProtect, updateTemplate);
router.delete('/:id', adminProtect, deleteTemplate);

export default router;
