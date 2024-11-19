import Cookieparser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { isHttpError } from 'http-errors';
import path from 'path';
import env from '../utils/validateEnv.util';
import routers from './router.config';
const app = express();
app.use(
  cors({
    origin: env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(Cookieparser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../../../uploads')));
app.use('/api/hello', (req, res) => {
  res.send('Hello World');
});

routers.forEach(({ path, router }) => {
  app.use(path, router);
});


export default app;
