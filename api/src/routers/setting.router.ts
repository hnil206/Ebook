import { Router } from 'express';
import roleRequire from '../configs/middleware.config';
import {
  getAllSetting,
  getSetting,
  newSetting,
} from '../services/setting.service';

const router = Router();
router.get('/setting', roleRequire(), async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const setting = await getSetting(userId);
    console.log('setting', setting);
    res.status(200).json(setting);
  } catch (error) {
    console.error('Error in /setting route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/setting', await roleRequire(), async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const data = req.body;
    // console.log('body: ', JSON.stringify(data));
    const setting = await newSetting(data, userId);
    res.status(201).json(setting);
  } catch (error) {
    console.error('Error in /setting route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/all-setting', async (req, res) => {
  const settings = await getAllSetting();
  res.json(settings);
});
export default router;
