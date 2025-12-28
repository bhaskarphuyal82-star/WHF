"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/Providers";

interface Message {
    _id: string;
    senderRole: 'admin' | 'member' | 'guest';
    content: string;
    createdAt: string;
    senderName: string;
}

export default function ChatWidget() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [conversationId, setConversationId] = useState<string>("");
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize Conversation ID
    useEffect(() => {
        let id = localStorage.getItem("whf_chat_id");
        if (!id) {
            if (user?.id) {
                id = user.id;
            } else {
                id = 'guest_' + Math.random().toString(36).substring(2, 9);
            }
            localStorage.setItem("whf_chat_id", id as string);
        }
        setConversationId(id || "");
    }, [user]);

    // Poll for messages
    useEffect(() => {
        if (!isOpen || !conversationId) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Error polling messages:", error);
            }
        };

        fetchMessages(); // Initial fetch
        const interval = setInterval(fetchMessages, 3000); // Poll every 3s

        return () => clearInterval(interval);
    }, [isOpen, conversationId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim() || !conversationId) return;

        const newMessage = {
            conversationId,
            senderRole: user ? 'member' : 'guest',
            senderName: user?.name || 'Guest',
            content: inputValue,
            senderId: user?.id,
        };

        // Optimistic update
        setMessages(prev => [...prev, {
            _id: 'temp_' + Date.now(),
            senderRole: newMessage.senderRole as any,
            content: newMessage.content,
            senderName: newMessage.senderName,
            createdAt: new Date().toISOString()
        }]);
        setInputValue("");

        try {
            await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage),
            });
            // The polling will sync the real state shortly
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-orange-600 hover:bg-orange-700 shadow-xl z-50 flex items-center justify-center transition-all hover:scale-110"
            >
                <MessageCircle className="w-8 h-8 text-white" />
            </Button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 w-80 md:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-orange-600 rounded-t-2xl text-white">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-full">
                        <User className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">WHF Support</h3>
                        <p className="text-xs text-orange-200">We respond typically in minutes</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded">
                        <Minimize2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950/50">
                        {messages.length === 0 ? (
                            <div className="text-center text-zinc-400 mt-8 text-sm">
                                <p>Hi {user?.name || 'there'}! 👋</p>
                                <p>How can we verify or help you today?</p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isAdmin = msg.senderRole === 'admin';
                                return (
                                    <div key={msg._id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${isAdmin
                                            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none'
                                            : 'bg-orange-600 text-white rounded-tr-none'
                                            }`}>
                                            <p>{msg.content}</p>
                                            <span className="text-[10px] opacity-70 block mt-1">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-b-2xl">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type a message..."
                                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-orange-500 outline-none dark:text-white"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
