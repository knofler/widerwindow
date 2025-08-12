import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export type AuthPayload = { sub: string; email: string; role: 'admin' | 'author'; name?: string };

export function signAuthToken(payload: AuthPayload, days = 7) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${days}d` });
}

export function verifyAuthFromRequest(req: Request): AuthPayload | null {
  try {
    const header = req.headers.get('cookie') || '';
    const cookies = parse(header);
    const token = cookies['token'];
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch {
    return null;
  }
}
