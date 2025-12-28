"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Send, User, Clock, MessageSquare } from "lucide-react";

interface Conversation {
    conversationId: string;
    lastMessage: string;
    lastMessageAt: string;
    displayName: string;
    role: string;
    unreadCount: number;
}

interface Message {
    _id: string;
    senderRole: 'admin' | 'member' | 'guest';
    content: string;
    createdAt: string;
    senderName: string;
}

export default function AdminMessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch conversations list
    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/chat/conversations');
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
            setLoading(false);
        }
    };

    // Initial load and polling for list
    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 5000);
        return () => clearInterval(interval);
    }, []);

    // Fetch messages for selected conversation
    useEffect(() => {
        if (!selectedConvId) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat/messages?conversationId=${selectedConvId}`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Faster poll for active chat
        return () => clearInterval(interval);
    }, [selectedConvId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedConvId]);

    const handleSend = async () => {
        if (!inputText.trim() || !selectedConvId) return;

        const newMessagePayload = {
            conversationId: selectedConvId,
            senderRole: 'admin',
            senderName: 'Admin', // Static for now, could use auth user name
            content: inputText,
        };

        // Optimistic update
        setMessages(prev => [...prev, {
            _id: 'temp_' + Date.now(),
            senderRole: 'admin',
            content: inputText,
            senderName: 'Admin',
            createdAt: new Date().toISOString()
        }]);
        setInputText("");

        try {
            await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessagePayload),
            });
            fetchConversations(); // Update list order/snippet
        } catch (error) {
            console.error("Failed to send:", error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const selectedConversation = conversations.find(c => c.conversationId === selectedConvId);

    return (
        <div className="h-[calc(100vh-theme(spacing.24))] flex gap-6 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-1/3 bg-white/5 border border-white/10 rounded-xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : conversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                            <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                            <p>No messages yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {conversations.map(conv => (
                                <button
                                    key={conv.conversationId}
                                    onClick={() => setSelectedConvId(conv.conversationId)}
                                    className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors text-left ${selectedConvId === conv.conversationId ? 'bg-white/10' : ''}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {conv.displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-white truncate">{conv.displayName}</span>
                                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                {new Date(conv.lastMessageAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 truncate pr-4">{conv.lastMessage}</p>
                                    </div>
                                    {conv.unreadCount > 0 && selectedConvId !== conv.conversationId && (
                                        <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-1">
                                            {conv.unreadCount}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl flex flex-col overflow-hidden">
                {selectedConvId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{selectedConversation?.displayName || 'Unknown'}</h3>
                                    <span className="text-xs text-gray-400 capitalize bg-white/10 px-2 py-0.5 rounded-full">
                                        {selectedConversation?.role || 'Guest'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.map((msg) => {
                                const isAdmin = msg.senderRole === 'admin';
                                return (
                                    <div key={msg._id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] group ${isAdmin ? 'order-2' : 'order-1'}`}>
                                            <div className="flex items-center gap-2 mb-1 px-1">
                                                <span className={`text-xs font-medium ${isAdmin ? 'text-orange-400 ml-auto' : 'text-gray-400'}`}>
                                                    {msg.senderName}
                                                </span>
                                                <span className="text-[10px] text-gray-600">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className={`p-4 rounded-2xl text-sm ${isAdmin
                                                    ? 'bg-orange-600 text-white rounded-tr-none shadow-lg shadow-orange-900/20'
                                                    : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-black/20">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type your reply..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputText.trim()}
                                    className="px-6 bg-orange-600 hover:bg-orange-500 text-white rounded-xl flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Send</span>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <MessageSquare className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Select a Conversation</h3>
                        <p className="max-w-xs text-center">Choose a chat from the sidebar to start messaging with members or guests.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
