import { Request, Response, Router } from 'express';
import roleRequire, { authMiddleware } from '../configs/middleware.config';
import User from '../models/user.model';
import { decode } from '../services/auth.service';
const router = Router();
router.put('/upgrade-premium', roleRequire(), async (req: Request, res: Response) => {
  try {
    console.log('upgrade-premium');
    const userId = req.userId;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 'premiumStatus.isPremium': true },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// router.get('/:id', await roleRequire, async (req: Request, res: Response) => {
//   try {
//     const userId = req.userId; // Use req.userId from the roleRequire middleware
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     return res.status(200).json(user);
//   } catch (error) {
//     console.error('Error fetching user profile:', error);
//     return res.status(500).json({ error: 'Error fetching user profile' });
//   }
// });

// router.put(
//   '/:id',
//   authMiddleware,
//   roleRequire(['user']),
//   async (req: Request, res: Response) => {
//     try {
//       const userId = req.userId; // Use req.userId from the roleRequire middleware
//       const { username, image } = req.body;

//       const updateData = { username, image };

//       const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
//         new: true,
//         runValidators: true,
//       });

//       if (!updatedUser) {
//         return res.status(404).json({ error: 'User not found' });
//       }
//     } catch (error) {}
//   },
// );

router.get('/user-info', roleRequire(), async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const decoded = await decode(token);
  const userId = decoded.id;
  const user = await User.findById(userId);
  res.status(200).json(user);
});

router.put('/update-user', roleRequire(), async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  const decoded = await decode(token);
  const userId = decoded.id;
  const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
  res.status(200).json(updatedUser);
});
export default router;

