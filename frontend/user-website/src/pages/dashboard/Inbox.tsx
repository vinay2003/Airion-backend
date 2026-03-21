import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore, ChatThread, Message } from '../../store/useDashboardStore';
import { Send, Search, Check, CheckCheck, Paperclip } from 'lucide-react';

export const Inbox: React.FC = () => {
    const { chatThreads, sendMessage } = useDashboardStore();
    const [selectedThreadId, setSelectedThreadId] = useState<string>(chatThreads[0]?.id || '');
    const [messageText, setMessageText] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const selectedThread = chatThreads.find(t => t.id === selectedThreadId);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedThread) return;
        sendMessage(selectedThread.id, messageText);
        setMessageText('');
    };

    const filteredThreads = chatThreads.filter(t => 
        t.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    {filteredThreads.map((thread: ChatThread) => (
                        <div 
                            key={thread.id}
                            onClick={() => setSelectedThreadId(thread.id)}
                            className={`p-4 flex gap-3 border-b border-neutral-50 dark:border-slate-800/40 cursor-pointer hover:bg-neutral-50/80 dark:hover:bg-slate-800/50 transition
                                ${selectedThreadId === thread.id ? 'bg-red-50/50 dark:bg-red-500/5 border-r-2 border-r-red-500' : ''}
                            `}
                        >
                            <div className="h-11 w-11 rounded-full overflow-hidden relative flex-shrink-0">
                                <img src={thread.vendorAvatar} alt={thread.vendorName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">{thread.vendorName}</h4>
                                    <span className="text-[10px] text-neutral-400">{thread.timestamp}</span>
                                </div>
                                <p className={`text-xs mt-0.5 truncate ${thread.unread ? 'font-bold text-neutral-900 dark:text-white' : 'text-neutral-500'}`}>
                                    {thread.lastMessage}
                                </p>
                            </div>
                            {thread.unread && (
                                <div className="h-2 w-2 rounded-full bg-red-500 mt-2 self-start" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            {selectedThread ? (
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-neutral-100 dark:border-slate-800 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img src={selectedThread.vendorAvatar} alt={selectedThread.vendorName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{selectedThread.vendorName}</h3>
                            <span className="text-xs text-green-500">Online</span>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {selectedThread.messages.map((m: Message) => (
                            <div 
                                key={m.id} 
                                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-md px-4 py-2.5 rounded-2xl text-sm
                                    ${m.sender === 'user' 
                                        ? 'bg-red-500 text-white rounded-br-none' 
                                        : 'bg-neutral-100 dark:bg-slate-800 text-neutral-800 dark:text-slate-200 rounded-bl-none'
                                    }
                                `}>
                                    <p>{m.text}</p>
                                    <div className={`flex items-center gap-0.5 text-[10px] mt-1 ${m.sender === 'user' ? 'text-red-100 justify-end' : 'text-neutral-400'}`}>
                                        {m.timestamp}
                                        {m.sender === 'user' && <CheckCheck size={12} className="text-red-100" />}
                                    </div>
                                </div>
                            </div>
                        ))}
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
                        <button type="submit" className="p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-md">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-neutral-400">
                     Select a conversation to start chatting.
                </div>
            )}
        </div>
    );
};

export default Inbox;
