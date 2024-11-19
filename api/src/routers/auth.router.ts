import { Router } from 'express';
import roleRequire from '../configs/middleware.config';
import authenticate, {
  decode,
  generateToken,
  getUser,
} from '../services/auth.service';

const router = Router();

router.get(
  '/',
  await roleRequire(['user', 'admin', 'abc', 'xyz']),
  async (req, res, next) => {
    const userId = req.userId;
    const role = req.userRole;
    res.json({ userId: userId, role: role });
  },
);

router.post('/', async (req, res) => {
  const { provider, providerAccountId, name, email, image, username } =
    req.body;
  const result = await authenticate(
    { name, email, image, username },
    { provider, providerAccountId },
  );
  return res.json(result);
});

router.post('/token', async (req, res) => {
  const { provider, providerAccountId } = req.body;
  const result = await generateToken({ provider, providerAccountId });
  return res.json(result);
});

router.get('/decode/:token', async (req, res) => {
  const { token } = req.params;
  const result = await decode(token);
  return res.json(result);
});

router.get('/user', roleRequire(), async (req, res) => {
  const userId = req.userId as string;
  const user = await getUser(userId);
  return res.json(user);
});

export default router;
