import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage';

// GET: Fetch messages for a specific conversation
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get('conversationId');

        if (!conversationId) {
            return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
        }

        const messages = await ChatMessage.find({ conversationId })
            .sort({ createdAt: 1 }) // Oldest first
            .lean();

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Internal User Error' }, { status: 500 });
    }
}

// POST: Send a new message
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { conversationId, senderRole, senderName, content, senderId } = body;

        // Validation
        if (!conversationId || !senderRole || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newMessage = await ChatMessage.create({
            conversationId,
            senderId,
            senderRole,
            senderName: senderName || 'Guest',
            content,
            isRead: false
        });

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Internal User Error' }, { status: 500 });
    }
}
