import axios from 'axios';
import { env } from './validateEnv';
export default axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function axiosWithAuth(token: string) {
  return axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}