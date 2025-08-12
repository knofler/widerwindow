import mongoose from 'mongoose';

const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
const DEFAULT_DEV_URI = 'mongodb://localhost:27017/widerwindow';
const MONGODB_URI = process.env.MONGODB_URI || (isProd ? '' : DEFAULT_DEV_URI);
const MONGODB_DB = process.env.MONGODB_DB; // optional override when URI has no /db

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set');
}

function mask(uri: string) {
  try { return uri.replace(/(mongodb(?:\+srv)?:\/\/)([^@]+)@/i, '$1***@'); } catch { return uri; }
}

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const g = globalThis as any;
if (!g.__mongoose) g.__mongoose = { conn: null, promise: null } as Cache;
const cached: Cache = g.__mongoose as Cache;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    if (!isProd) console.log('[mongo] connecting to', mask(MONGODB_URI), MONGODB_DB ? `(db=${MONGODB_DB})` : '');
    cached.promise = mongoose
      .connect(MONGODB_URI as string, {
        serverSelectionTimeoutMS: 12000,
        maxPoolSize: 5,
        minPoolSize: 0,
        dbName: MONGODB_DB || undefined,
      } as any)
      .then((m: typeof mongoose) => m)
      .catch((err: any) => {
        cached.promise = null;
        console.error('[mongo] connection error for', mask(MONGODB_URI), '-', err?.message || err);
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
