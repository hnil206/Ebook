
import Post from '../models/post.model';

async function getPost(
  options?: any,
  skip?: number,
  take?: number,
): Promise<{ posts: InstanceType<typeof Post>[]; total: number }> {
  let query = Post.find();
  if (options?.userId) {
    query = query.where('userId', options.userId);
  }
  // if (options?.tags) {
  //     const tags = await Tag.find({ name: { $in: options.tags.split(',') } });
  //     const tagIds = tags.map((tag) => tag._id);
  //     query = query.where('tags').in(tagIds);
  // }
//   if (options?.brand) {
//     query = query.where('brand', options.brand).sort({ createdAt: -1 });
//   }
  if (options?.title) {
    query = query
      .where('title', new RegExp(options.title, 'i'))
      .sort({ createdAt: -1 });
  }
  if (skip) {
    query = query.skip(skip);
  }
  if (take) {
    query = query.limit(take);
  }

  const [result, total] = await Promise.all([
    query
      .populate({
        path: 'user',
        select: 'username email avatar',
        options: {
          as: 'user',
        },
      })
      .sort({ createdAt: -1 }),
    Post.countDocuments(query.getQuery()), // Đếm tổng số bài viết
  ]);

  return { posts: result, total };

  // const result = await query.populate({

  // });
  // return result;
}
async function addPost(
  data: any,
  userId: string,
): Promise<InstanceType<typeof Post>> {
  const post = new Post({
    userId: userId,
    title: data.title,
    image: data.image,
    content: data.content,
    createdAt: new Date(),
  });
  return await post.save();
}

async function getPostById(postId: string): Promise<InstanceType<typeof Post> | null> {
  return await Post.findById(postId)
    .populate({
      path: 'user',
      select: 'username email avatar',
      options: {
        as: 'user',
      },
    })
    //     .populate({
    //     path: 'comments',
    //     populate: {
    //
    //     }
    // })
    .exec();
}

export { addPost, getPost, getPostById };
