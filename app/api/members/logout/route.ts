import { NextResponse } from 'next/server';

// POST - Member logout
export async function POST() {
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Clear the member token cookie
    response.cookies.set('member_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    });

    return response;
}
