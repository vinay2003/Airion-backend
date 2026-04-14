import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchConversations, fetchMessages, startConversation } from '../../lib/api';
import { initiateSocketConnection, getSocket } from '@shared/auth/socket';
import { useAuth } from '@shared/auth/AuthContext';
import { Send, Search, CheckCheck, Paperclip, Mail } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

export const Inbox: React.FC = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [selectedThreadId, setSelectedThreadId] = useState<string>('');
    const [messageText, setMessageText] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch Conversations
    const { data: conversations = [], isLoading: loadingConversations } = useQuery({
        queryKey: ['conversations'],
        queryFn: fetchConversations,
    });

    // Fetch Messages for selected thread
    const { data: messages = [], isLoading: loadingMessages } = useQuery({
        queryKey: ['messages', selectedThreadId],
        queryFn: () => fetchMessages(selectedThreadId),
        enabled: !!selectedThreadId,
    });

    const selectedChat = conversations.find((c: any) => c.id === selectedThreadId);

    // Socket Setup
    useEffect(() => {
        if (!user?.id) return;
        const socket = initiateSocketConnection(user.id);

        socket.on('receiveMessage', (message: any) => {
            if (message.conversationId === selectedThreadId) {
                queryClient.setQueryData(['messages', selectedThreadId], (old: any) => [...(old || []), message]);
            }
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [user?.id, selectedThreadId, queryClient]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedThreadId) return;

        const socket = getSocket();
        if (socket) {
            socket.emit('sendMessage', {
                conversationId: selectedThreadId,
                senderId: user?.id,
                body: messageText,
            });
            setMessageText('');
        }
    };

    const filteredConversations = conversations.filter((c: any) => 
        c.participantIds.length > 0 // Add mapping for names if needed
    );

    if (loadingConversations) return <div className="h-[500px] flex gap-4"><Skeleton className="w-80" /><Skeleton className="flex-1" /></div>;

    return (
        <div className="h-[calc(100vh-140px)] flex border border-neutral-200/60 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
            {/* Sidebar / Threads List */}
            <div className="w-80 border-r border-neutral-200/60 dark:border-slate-800 flex flex-col">
                <div className="p-4 border-b border-neutral-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Messages</h2>
                    <div className="flex items-center gap-2 bg-neutral-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-neutral-200/30 dark:border-slate-700/50">
                        <Search size={16} className="text-neutral-400" />
                        <input 
                            type="text" 
                            placeholder="Search chats..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-neutral-700 dark:text-neutral-200 w-full" 
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map((chat: any) => (
                        <div 
                            key={chat.id}
                            onClick={() => setSelectedThreadId(chat.id)}
                            className={`p-4 flex gap-3 border-b border-neutral-50 dark:border-slate-800/40 cursor-pointer hover:bg-neutral-50/80 dark:hover:bg-slate-800/50 transition
                                ${selectedThreadId === chat.id ? 'bg-red-50/50 dark:bg-red-500/5 border-r-2 border-r-red-500' : ''}
                            `}
                        >
                            <div className="h-11 w-11 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600 flex-shrink-0">
                                {chat.participantIds.length > 1 ? 'V' : 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">Vendor Chat</h4>
                                    <span className="text-[10px] text-neutral-400">
                                        {chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                                <p className="text-xs mt-0.5 truncate text-neutral-500">
                                    {chat.lastMessage || 'Start conversation'}
                                </p>
                            </div>
                        </div>
                    ))}
                    {filteredConversations.length === 0 && (
                        <div className="p-8 text-center text-neutral-400 text-sm">
                            <Mail size={32} className="mx-auto mb-2 opacity-20" />
                            No conversations yet
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Window */}
            {selectedThreadId ? (
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-neutral-100 dark:border-slate-800 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600">
                            V
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Vendor Partner</h3>
                            <span className="text-xs text-green-500">Active now</span>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {loadingMessages ? (
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-1/2" />
                                <Skeleton className="h-10 w-1/3 ml-auto" />
                            </div>
                        ) : (
                            messages.map((m: any) => (
                                <div 
                                    key={m.id} 
                                    className={`flex ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-md px-4 py-2.5 rounded-2xl text-sm
                                        ${m.senderId === user?.id 
                                            ? 'bg-red-500 text-white rounded-br-none' 
                                            : 'bg-neutral-100 dark:bg-slate-800 text-neutral-800 dark:text-slate-200 rounded-bl-none'
                                        }
                                    `}>
                                        <p>{m.body}</p>
                                        <div className={`flex items-center gap-0.5 text-[10px] mt-1 ${m.senderId === user?.id ? 'text-red-100 justify-end' : 'text-neutral-400'}`}>
                                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {m.senderId === user?.id && <CheckCheck size={12} className="text-red-100" />}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-100 dark:border-slate-800 flex items-center gap-2">
                        <button type="button" className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-slate-200 rounded-lg">
                            <Paperclip size={20} />
                        </button>
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="flex-1 bg-neutral-100 dark:bg-slate-800 border-none outline-none p-2.5 rounded-xl text-sm" 
                        />
                        <button type="submit" disabled={!messageText.trim()} className="p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-md transition-all disabled:opacity-50">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-neutral-400">
                    <div className="text-center">
                        <Mail size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="font-medium">Select a conversation to start chatting.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inbox;
