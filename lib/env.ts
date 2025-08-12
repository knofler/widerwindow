export const isVercel = !!process.env.VERCEL;
export const isProd = process.env.NODE_ENV === 'production' || isVercel;
