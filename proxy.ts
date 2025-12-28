import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // If trying to access admin routes (except login page)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        // Check for admin token cookie
        const adminToken = request.cookies.get('admin_token')?.value;

        // If not authenticated as admin, redirect to login
        if (!adminToken) {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // If authenticated admin trying to access login page, redirect to admin dashboard
    if (pathname === '/admin/login') {
        const adminToken = request.cookies.get('admin_token')?.value;
        if (adminToken) {
            const adminUrl = new URL('/admin', request.url);
            return NextResponse.redirect(adminUrl);
        }
    }

    // Protect member dashboard - redirect to login if not authenticated
    if (pathname === '/dashboard') {
        const memberToken = request.cookies.get('member_token')?.value;
        if (!memberToken) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/dashboard'],
};
