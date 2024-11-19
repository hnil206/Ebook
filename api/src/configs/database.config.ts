// import mongoose from 'mongoose';

// import env from '../utils/validateEnv.util';
// interface CachedConnection {
//   conn: mongoose.Connection | null;
//   promise: Promise<mongoose.Connection> | null;
// }

// let cached: CachedConnection = global.mongoose || { conn: null, promise: null };

// if (!global.mongoose) {
//   global.mongoose = cached;
// }

// // export default async function initializeDatabase() {
// //   await mongoose
// //     .connect(env.MONGO_URI)
// //     .then(() => console.log('💓 Connected to MongoDB'))
// //     .catch((err) => console.error('💔 Failed to connect to MongoDB', err));
// // }

// export default async function initializeDatabase(): Promise<mongoose.Connection> {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose
//       .connect(env.MONGO_URI, opts)
//       .then((mongoose) => {
//         console.log('💓 Connected to MongoDB');
//         return mongoose.connection;
//       })
//       .catch((error) => {
//         console.error('💔 Failed to connect to MongoDB', error);
//         throw error;

//       });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// }

// export function isConnected(): boolean {
//   return cached.conn !== null && cached.conn.readyState === 1;
// }

// export async function ensureDbConnected(): Promise<void> {
//   if (!isConnected()) {
//     await initializeDatabase();
//   }
// }

import mongoose from 'mongoose';
import env from '../utils/validateEnv.util';

let connection: mongoose.Connection | null = null;

export default async function initializeDatabase(): Promise<void> {
  if (connection) return;

  try {
    await mongoose.connect(env.MONGO_URI);
    connection = mongoose.connection;
    console.log('💓 Connected to MongoDB');
  } catch (error) {
    console.error('💔 Failed to connect to MongoDB', error);
    throw error;
  }
}

export function getConnection(): mongoose.Connection | null {
  return connection;
}

export function isConnected(): boolean {
  return connection !== null && connection.readyState === 1;
}
