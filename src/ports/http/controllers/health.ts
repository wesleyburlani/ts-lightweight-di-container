import z from 'zod';
import { Router, Request, Response } from 'express';
import { Socket } from 'socket.io';

const router = Router();

export const HealthResponseSchema = z.object({
    status: z.enum(["healthy"]),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

router.get("/health", async(req: Request, res: Response): Promise<void> => {
    const socket: Socket = req.app.get('socket');

    socket.emit('health');

    res.status(200).json({
        status: 'healthy',
    } as HealthResponse);
});

export default router;