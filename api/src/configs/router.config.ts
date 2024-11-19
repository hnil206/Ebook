import type { Router } from 'express';
import authRouter from '../routers/auth.router';
// import bookRouter from '../routers/book.router';
import commentRouter from '../routers/comment.router';
import favouriteRouter from '../routers/favourite.router';
import fileRouter from '../routers/file.router';
import newBookRouter from '../routers/book.router';
import notificationRouter from '../routers/notification.router';
import orderRouter from '../routers/order.router';
import ratingRouter from '../routers/rating.router';
import readerRouter from '../routers/reader.router';
import settingRouter from '../routers/setting.router';
import shopRouter from '../routers/shop.router';
import userRouter from '../routers/user.router';
import postRouter from '../routers/post.router';

interface IRouterConfig {
  path: string;
  router: Router;
}
export default [
  // {
  //   path: '/api/hello',
  //   router: (res, req) => {
  //     res.send('Hello World');
  //   },
  // },
  {
    path: '/api/auth',
    router: authRouter,
  },
  // {
  //   path: '/api/books',
  //   router: bookRouter,
  // },
  {
    path: '/api/book',
    router: newBookRouter,
  },
  {
    path: '/api/upload',
    router: fileRouter,
  },
  {
    path: '/api/ebook',
    router: settingRouter,
  },
  {
    path: '/api/notification',
    router: notificationRouter,
  },
  {
    path: '/api/reader',
    router: readerRouter,
  },
  {
    path: '/api/comment',
    router: commentRouter,
  },
  {
    path: '/api/shop',
    router: shopRouter,
  },
  {
    path: '/api/users', // Add the path for users
    router: userRouter,
  },
  {
    path: '/api/ratings',
    router: ratingRouter,
  },
  {
    path: '/api/favourites',
    router: favouriteRouter,
  },
  {
    path: '/api/orders',
    router: orderRouter,
  },
  {
    path: '/api/post',
    router: postRouter,
  }
] as IRouterConfig[];
