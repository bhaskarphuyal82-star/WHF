import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_NAME = 'admin_token';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

// Generate JWT token
export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });
}

// Verify JWT token
export function verifyToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

// Create HTTP-only cookie with token
export function createTokenCookie(token: string): string {
    return serialize(TOKEN_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

// Create cookie to clear token
export function clearTokenCookie(): string {
    return serialize(TOKEN_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    });
}

// Get token from request cookies
export function getTokenFromRequest(request: NextRequest): string | null {
    const token = request.cookies.get(TOKEN_NAME);
    return token ? token.value : null;
}

// Verify authentication from request
export function verifyAuth(request: NextRequest): TokenPayload | null {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    return verifyToken(token);
}

// Verify member authentication from request
export function verifyMemberAuth(request: NextRequest): TokenPayload | null {
    const token = request.cookies.get('member_token');
    if (!token) return null;
    return verifyToken(token.value);
}
