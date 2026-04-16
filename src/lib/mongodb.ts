// En tu archivo de conexión
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://root:Aa8ge0050@127.0.0.1:27018/blog-arbey?authSource=admin";

if (!MONGODB_URI) {
  throw new Error("Por favor define MONGODB_URI en tu archivo .env");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: true, // Cambia esto a true para que espere la conexión
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;