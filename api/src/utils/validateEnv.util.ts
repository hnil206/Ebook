import { cleanEnv, port, str } from 'envalid';
export default cleanEnv(process.env, {
  PORT: port({ default: 5000 }),
  CLIENT_URL: str({ default: 'http://localhost:3000' }),
  MONGO_URI: str({ default: 'mongodb://localhost:27017/ebook' }),
  JWT_SECRET: str({ default: 'secret' }),
  REFRESH_SECRET: str({ default: 'refresh' }),
  EXPIRE_JWT: str({ default: '2h' }),
  EXPIRE_REFRESH: str({ default: '7d' }),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
});
