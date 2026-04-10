import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";

if (!MONGODB_URI) {
  throw new Error("Por favor define MONGODB_URI en su archivo .env.local");
}

/**
 * Global se usa aquí para mantener la conexión cacheada a través de
 * las recargas en caliente (hot reloading) de Next.js en desarrollo.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Opcional: Si en algún archivo lo importas sin llaves { }, añade esto:
export default connectDB;