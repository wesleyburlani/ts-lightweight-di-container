import { z } from "zod";
import { Router, Request, Response } from "express";
import Container from "typedi";
import { Service } from "~/services/service";

const router = Router();

const TypeSchema = z.object({
    name: z.string(),
});

export type Type = z.infer<typeof TypeSchema>;

router.get("/service", async(req: Request, res: Response): Promise<void> => {
    const service = Container.get(Service);
    const resp = await service.list();
    res.status(200).json(resp);
});

router.post("/service", async(req: Request, res: Response): Promise<void> => {
    let body: Type;
    try {
        body = await TypeSchema.parseAsync(req.body);
    } catch (e) {
        const error: Error = e as Error;
        res.status(400).json(error);
        return;
    }
    
    const service = Container.get(Service);
    const resp = await service.create(body);
    res.status(200).json(resp);
});

export default router;