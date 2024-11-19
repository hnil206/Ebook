import roleRequire from "../configs/middleware.config";
import { addPost, getPost, getPostById } from "../services/post.service";
import { Router } from "express";

const router = Router();

router.post('/', roleRequire(['admin']), async (req, res) => {
    const userId = req.userId as string;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await addPost(req.body, userId);
    res.status(200).json(post);
});
router.get('/', async (req, res) => {
    const {posts, total} = await getPost();
    res.status(200).json({posts, total});
});
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const post = await getPostById(id);
    res.status(200).json(post);
});
export default router;