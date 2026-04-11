import express, { Router } from 'express';

const router: Router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check Endpoint
 *     description: A simple endpoint to check if the backend server is running and responding to requests.
 *     responses:
 *       200:
 *         description: Server is running and healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Backend server is running!
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend server is running!' });
});

export default router;
