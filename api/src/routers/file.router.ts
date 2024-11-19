import { Router } from 'express';
import upload from '../configs/multer.config';
import { uploadFile } from '../services/file.service';

const router = Router();
router.post('/', upload.single('file'), async (req, res) => {
  try {
    // console.log('req.file', req.file);
    if (!req.file || Object.keys(req.file).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const { type = 'other', relatedId = '', onModel = '' } = req.body;
    // const validTypes = ['avatar', 'clother', 'other'];
    //   const validModels = ['User', 'Clothes'];

    //   if (!validTypes.includes(type)) {
    //     return res.status(400).json({ error: 'Invalid type provided' });
    //   }
    //   if (!validModels.includes(onModel)) {
    //     return res.status(400).json({ error: 'Invalid model provided' });
    //   }
    const multerFile = {
      buffer: req.file?.buffer,
      originalname: req.file?.originalname,
      mimetype: req.file?.mimetype,
    } as Express.Multer.File;

    const uploadedFile = await uploadFile(multerFile, type, relatedId, onModel);
    return res.status(201).json(uploadedFile);
  } catch (error) {
    console.error('Error when uploading file:', error);
    return res.status(500).json({ error: 'Error when uploading file' });
  }
});
export default router;
