import { NextFunction, Request, Response, Router } from 'express';
import roleRequire from '../configs/middleware.config';
import { getNotification } from '../services/notification.service';

const router = Router();
router.get(
  '/',
  roleRequire,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const number = req.query.number
      ? parseInt(req.query.number as string)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string)
      : undefined;
    const take = req.query.take
      ? parseInt(req.query.take as string)
      : undefined;

    const { notifications, total } = await getNotification(userId, skip, take);
    return res.status(200).json(notifications);
  },
);

export default router;
