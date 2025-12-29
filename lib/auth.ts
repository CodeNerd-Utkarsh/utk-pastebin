import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET: string | null = process.env.JWT_SECRET || null;
if (!SECRET) throw new Error('JWT secret is missing from env variables')

/**
 * Hash a plain password with bcrypt.
 * 10 rounds: fast and fine for learning; increase later (e.g., 12) for production.
 */

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
}


/**
 * Compare a plain password against a stored bcrypt hash.
 */


export async function verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword)
}

/**
 * Create a 1-hour access token that the client will send as a Bearer token.
 */

export function createAccessToken(uid: string) {
    return jwt.sign({ uid, type: 'access' }, SECRET as string, { expiresIn: '1h' })
}

/**
 * Create a 7-day refresh token stored in an httpOnly cookie.
 */

export function createRefreshToken(uid: string) {
    return jwt.sign({ uid, type: 'refresh' }, SECRET as string, { expiresIn: '1d' })
}

/**
 * Verify a JWT and return its payload, or null if invalid/expired.
 */
export function verifyToken(token: string) {
    try {
        return jwt.verify(token, SECRET as string);
    }
    catch {
        throw new Error('Token verification failed');
    }
}