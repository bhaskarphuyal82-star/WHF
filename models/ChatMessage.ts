import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
    conversationId: string;
    senderId?: string; // User ID or Admin ID
    senderRole: 'admin' | 'member' | 'guest';
    senderName: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
    {
        conversationId: { type: String, required: true, index: true },
        senderId: { type: String },
        senderRole: { type: String, enum: ['admin', 'member', 'guest'], required: true },
        senderName: { type: String, required: true },
        content: { type: String, required: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
