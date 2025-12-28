import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User'; // Import User to ensure model registration
import { verifyAuth } from '@/lib/auth';

// GET /api/posts - List all posts
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        // Ensure User model is registered for population
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = User;

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category');
        const published = searchParams.get('published');
        const search = searchParams.get('search');

        const skip = (page - 1) * limit;

        // Build filter
        const filter: any = {};
        if (category) filter.category = category;
        if (published !== null) filter.published = published === 'true';
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ];
        }

        const [posts, total] = await Promise.all([
            Post.find(filter)
                .populate('author', 'name email image')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Post.countDocuments(filter),
        ]);

        return NextResponse.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Posts GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
    try {
        const payload = verifyAuth(request);
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();

        // Generate base slug from title
        let slug = body.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
            .trim();

        // If slug is empty (e.g., title has only non-Latin characters like Nepali),
        // generate a fallback slug using timestamp
        if (!slug || slug === '-') {
            slug = `post-${Date.now()}`;
        }

        // Check for duplicate slug and append counter if needed
        let uniqueSlug = slug;
        let counter = 1;
        while (await Post.findOne({ slug: uniqueSlug })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }

        const post = await Post.create({
            ...body,
            slug: uniqueSlug, // Explicitly set the unique slug
            author: payload.userId,
        });

        return NextResponse.json({ success: true, post }, { status: 201 });
    } catch (error: any) {
        console.error('Post CREATE error:', error);

        // Handle duplicate key error (usually slug collision)
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'A post with this title already exists. Please use a different title.' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create post' },
            { status: 500 }
        );
    }
}
