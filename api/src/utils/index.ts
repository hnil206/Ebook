import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `ORD-${year}${month}${day}-${nanoid()}`;
}