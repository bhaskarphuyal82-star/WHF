import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Aggregate to get unique conversations with metadata
        const conversations = await ChatMessage.aggregate([
            { $sort: { createdAt: -1 } }, // Sort by newest first
            {
                $group: {
                    _id: "$conversationId",
                    lastMessage: { $first: "$content" },
                    lastMessageAt: { $first: "$createdAt" },
                    senderName: { $first: "$senderName" }, // Name of the person in the last message (might be admin though)
                    senderRole: { $first: "$senderRole" },
                    unreadCount: {
                        $sum: {
                            $cond: [{ $and: [{ $eq: ["$isRead", false] }, { $ne: ["$senderRole", "admin"] }] }, 1, 0]
                        }
                    },
                    // We really want the guest/member name, not the admin's name if admin replied last
                    participants: { $addToSet: { name: "$senderName", role: "$senderRole" } }
                }
            },
            { $sort: { lastMessageAt: -1 } } // Sort conversation list by recent activity
        ]);

        // Post-processing to find the best display name (not admin)
        const formattedConversations = conversations.map(conv => {
            const otherParticipant = conv.participants.find((p: any) => p.role !== 'admin');
            return {
                conversationId: conv._id,
                lastMessage: conv.lastMessage,
                lastMessageAt: conv.lastMessageAt,
                displayName: otherParticipant ? otherParticipant.name : 'Unknown Guest',
                role: otherParticipant ? otherParticipant.role : 'guest',
                unreadCount: conv.unreadCount
            };
        });

        return NextResponse.json(formattedConversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
