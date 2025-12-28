
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Event from '@/models/Event';
import VideoModel from '@/models/Video';
import Representative from '@/models/Representative';
import Gallery from '@/models/Gallery';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        const [
            postsCount,
            eventsCount,
            videosCount,
            representativesCount,
            galleriesCount,
            usersCount,
            recentMembers
        ] = await Promise.all([
            Post.countDocuments(),
            Event.countDocuments(),
            VideoModel.countDocuments(),
            Representative.countDocuments(),
            Gallery.countDocuments(),
            User.countDocuments({ role: 'member' }),
            User.find({ role: 'member' })
                .select('name email membershipDate memberId image')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean()
        ]);

        return NextResponse.json({
            posts: postsCount,
            events: eventsCount,
            videos: videosCount,
            representatives: representativesCount,
            galleries: galleriesCount,
            users: usersCount,
            recentMembers
        });
    } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
