import type { Express, Request, Response } from 'express';

export const health = (app: Express) => {
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'API is healthy' });
  });
}
