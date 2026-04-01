import { Router } from 'express';
import { recordController } from '../controllers/record.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { recordSchema, updateRecordSchema, querySchema } from '../services/record.service.js';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /records:
 *   get:
 *     summary: List and search records (Analyst/Admin)
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [INCOME, EXPENSE] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of records
 *       403:
 *         description: Forbidden
 */
router.get('/', roleMiddleware('ANALYST', 'ADMIN'), validate(querySchema, 'query'), recordController.getAllRecords);

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Get record details
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Record details
 *       404:
 *         description: Not found
 */
router.get('/:id', roleMiddleware('ANALYST', 'ADMIN'), recordController.getRecordById);

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create new record (Admin only)
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount: { type: number }
 *               type: { type: string, enum: [INCOME, EXPENSE] }
 *               category: { type: string }
 *               date: { type: string, format: date }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', roleMiddleware('ADMIN'), validate(recordSchema), recordController.createRecord);

/**
 * @swagger
 * /records/{id}:
 *   patch:
 *     summary: Update record (Admin only)
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount: { type: number }
 *               type: { type: string, enum: [INCOME, EXPENSE] }
 *               category: { type: string }
 *               date: { type: string, format: date }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch('/:id', roleMiddleware('ADMIN'), validate(updateRecordSchema), recordController.updateRecord);

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Soft delete record (Admin only)
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', roleMiddleware('ADMIN'), recordController.deleteRecord);

export default router;
