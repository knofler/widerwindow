import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/widerwindow';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null } as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    } as any).then((m: typeof mongoose) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
