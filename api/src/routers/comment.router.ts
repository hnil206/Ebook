import { Router } from 'express';
import roleRequire from '../configs/middleware.config';
import {
  addComment,
  addReply,
  deleteComment,
  deleteReply,
  getCommentsByObjectId,
  updateComment,
  updateReply,
} from '../services/comment.service';

const router = Router();

router.post('/', roleRequire(), async (req, res) => {
  const userId = req.userId as string;
  const { objectId, content } = req.body;
  try {
    const comment = await addComment(userId, objectId, content);
    res.status(200).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/reply/:id', roleRequire(), async (req, res) => {
  const userId = req.userId as string;
  const rootCommentId = req.params.id;
  const { objectId, content } = req.body;
  try {
    const repply = await addReply(rootCommentId, userId, content);
    res.status(200).json(repply);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/:id', async (req, res) => {
  const objectId = req.params.id;
  try {
    const comments = await getCommentsByObjectId(objectId);
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//update comment
router.put('/:id', roleRequire(), async (req, res) => {
  const commentId = req.params.id;
  const userId = req.userId as string;
  const role = req.userRole as string[];
  console.log(role);
  const { content } = req.body;
  try {
    const comment = await updateComment(userId, commentId, content);
    res.status(200).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//update reply
router.put('/reply/:id', roleRequire(), async (req, res) => {
  const rootCommentId = req.params.id;
  const userId = req.userId as string;
  const { content, replyId } = req.body;
  try {
    const comment = await updateReply(userId, rootCommentId, replyId, content);
    res.status(200).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//delete comment
router.delete('/:id', roleRequire(), async (req, res) => {
  const commentId = req.params.id;
  const userId = req.userId as string;
  const role = req.userRole as string[];
  // console.log(role);
  try {
    const comment = await deleteComment(userId, commentId, role);
    res.status(200).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//delete reply
router.delete('/reply/:commentId/:replyId', roleRequire(), async (req, res) => {
  const rootCommentId = req.params.commentId;
  const replyId = req.params.replyId;
  const userId = req.userId as string;
  const role = req.userRole as string[];
  try {
    const comment = await deleteReply(userId, rootCommentId, replyId, role);
    res.status(200).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
