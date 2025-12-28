import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import mongoose from 'mongoose';
import { verifyAuth } from '@/lib/auth';

// GET /api/posts/[id] - Get single post
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        // Ensure User model is registered
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = User;

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
        }

        const post = await Post.findById(id).populate('author', 'name email image');

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ post });
    } catch (error) {
        console.error('Post GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
}

// PUT /api/posts/[id] - Update post
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = verifyAuth(request);
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { id } = await params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
        }

        const post = await Post.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, post });
    } catch (error) {
        console.error('Post UPDATE error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update post' },
            { status: 500 }
        );
    }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = verifyAuth(request);
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
        }

        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Post deleted' });
    } catch (error) {
        console.error('Post DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}
