import Comment from '../models/comment.model';

export async function addComment(
  userId: string,
  objectId: string,
  content: string,
): Promise<InstanceType<typeof Comment>> {
  const comment = new Comment({
    userId,
    objectId,
    content,
  });
  return await comment.save();
}

export async function getCommentsByObjectId(
  objectId: string,
): Promise<InstanceType<typeof Comment>[] | null> {
  console.log(objectId);
  return await Comment.find({ objectId })
    .populate('userId', 'username email image')
    .populate({
      path: 'replies.userId',
      select: 'username email image',
    });
}

export async function addReply(
  rootCommentId: string,
  userId: string,
  content: string,
) {
  const rootComment = await Comment.findById(rootCommentId);
  if (!rootComment) throw new Error('Comment not found');
  rootComment.replies.push({ userId, content });
  return await Comment.updateOne({ _id: rootCommentId }, rootComment);
}

export async function updateComment(
  userId: string,
  commentId: string,
  content: string,
): Promise<InstanceType<typeof Comment> | null> {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error('Comment not found'); // Kiểm tra bình luận có tồn tại không

  if (comment.userId.toString() !== userId) {
    throw new Error('Unauthorized: You can only update your own comments');
  }

  return await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
}

export async function updateReply(
  userId: string,
  rootCommentId: string,
  replyId: string,
  content: string,
): Promise<InstanceType<typeof Comment> | null> {
  const rootComment = await Comment.findById(rootCommentId);
  if (!rootComment) throw new Error('Comment not found');

  const reply = rootComment.replies.id(replyId);
  if (!reply) throw new Error('Reply not found');

  if (reply.userId.toString() !== userId) {
    throw new Error('Unauthorized: You can only update your own replies');
  }

  await Comment.updateOne(
    { _id: rootCommentId, 'replies._id': replyId },
    { $set: { 'replies.$.content': content } },
  );

  return await Comment.findById(rootCommentId);
}

export async function deleteComment(
  userId: string,
  commentId: string,
  role: string[],
): Promise<InstanceType<typeof Comment> | null> {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error('Comment not found');

  if (comment.userId.toString() !== userId && !role.includes('admin')) {
    throw new Error('Unauthorized: You can only delete your own comments');
  }

  return await Comment.findByIdAndDelete(commentId);
}
export async function deleteReply(
  userId: string,
  rootCommentId: string,
  replyId: string,
  role: string[],
): Promise<InstanceType<typeof Comment> | null> {
  const rootComment = await Comment.findById(rootCommentId);
  if (!rootComment) throw new Error('Comment not found');

  const replyIndex = rootComment.replies.findIndex(
    (reply) => reply.id === replyId,
  );
  if (replyIndex !== -1) {
    if (rootComment.replies[replyIndex].userId.toString() !== userId && !role.includes('admin')) {
      throw new Error('Unauthorized: You can only delete your own comments');
    } 
    rootComment.replies.splice(replyIndex, 1);
  } else {
    throw new Error('Reply not found');
  }

  // if (comment.userId.toString() !== userId && !role.includes('admin')) {
  // }
  await Comment.updateOne(
    { _id: rootCommentId },
    { replies: rootComment.replies },
  );
  return rootComment;
}
