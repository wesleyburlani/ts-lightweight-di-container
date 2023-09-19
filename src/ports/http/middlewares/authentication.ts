import { Request, Response, NextFunction } from "express"

export default(req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-auth');
    if (token != '123') {
        res.status(401).json({ status: "unauthorized" });
        return;
    }
    (req as any).token = token;
    next();
}