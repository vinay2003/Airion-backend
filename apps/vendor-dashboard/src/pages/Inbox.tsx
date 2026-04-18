import React, { useState } from 'react';
import { Search, MoreVertical, Send, Paperclip, Smile, Phone, Video, Info, ArrowLeft, User, ShieldCheck } from 'lucide-react';
import { Button } from '@ease2event/ui';

interface Chat {
    id: number;
    name: string;
    message: string;
    time: string;
    unread: number;
    avatar: string;
    online: boolean;
}

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'them';
    time: string;
}

/**
 * 📨 Communication Protocol (Inbox/Enquiries)
 * Modernized with theme-aware tokens, larger typography, and premium glassmorphism.
 */
const Inbox: React.FC = () => {
    const [activeChat, setActiveChat] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [showMobileChat, setShowMobileChat] = useState(false);

    const chats: Chat[] = [
        { id: 1, name: 'Rahul Kumar', message: 'Is the venue available for Dec 12?', time: '2m', unread: 2, avatar: 'R', online: true },
        { id: 2, name: 'Priya Singh', message: 'Thanks for the information!', time: '1h', unread: 0, avatar: 'P', online: true },
        { id: 3, name: 'Amit Shah', message: 'Can we schedule a visit?', time: '3h', unread: 0, avatar: 'A', online: false },
        { id: 4, name: 'Sneha Gupta', message: 'What are the catering options?', time: '5h', unread: 1, avatar: 'S', online: false },
        { id: 5, name: 'Vikram Patel', message: 'Looking for wedding venue', time: '1d', unread: 0, avatar: 'V', online: false },
    ];

    const messages: Message[] = [
        { id: 1, text: 'Hello! Yes, the Grand Ballroom is available for your dates.', sender: 'me', time: '10:30 AM' },
        { id: 2, text: "That's great! What is the capacity for a round table setup?", sender: 'them', time: '10:32 AM' },
        { id: 3, text: 'We can accommodate up to 350 guests with round tables and a dance floor.', sender: 'me', time: '10:35 AM' },
        { id: 4, text: 'Is the venue available for Dec 12?', sender: 'them', time: '10:38 AM' },
    ];

    const activeUser = chats.find(chat => chat.id === activeChat);
    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChatSelect = (chatId: number) => {
        setActiveChat(chatId);
        setShowMobileChat(true);
    };

    const handleBackToList = () => {
        setShowMobileChat(false);
    };

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            setMessageInput('');
        }
    };

    return (
        <div className="h-[calc(100vh-12rem)] bg-[var(--ease2event-bg-surface)] rounded-[2.5rem] shadow-2xl border border-[var(--ease2event-border-subtle)] overflow-hidden flex transition-all duration-500 relative">
            {/* Chat List */}
            <div className={`
                w-full md:w-96 border-r border-[var(--ease2event-border-subtle)] flex flex-col absolute md:relative inset-0 z-10 bg-[var(--ease2event-bg-surface)] transition-transform duration-500
                ${showMobileChat ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
            `}>
                {/* Search Header */}
                <div className="p-4 md:p-6 border-b border-[var(--ease2event-border-subtle)] bg-[var(--ease2event-bg-elevated)]/50">
                    <div className="flex items-center gap-3 bg-[var(--ease2event-bg-surface)] p-1 rounded-full border border-[var(--ease2event-border-subtle)] focus-within:border-blue-500/40 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all shadow-inner">
                        <div className="pl-3 py-2">
                            <Search className="text-[var(--ease2event-text-muted)] group-focus-within:text-blue-500 transition-colors" size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Filter transmissions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-[9px] font-black uppercase tracking-widest text-[var(--ease2event-text-primary)] placeholder-[var(--ease2event-text-muted)]"
                        />
                    </div>
                </div>

                {/* Chat List Items */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {filteredChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => handleChatSelect(chat.id)}
                            className={`p-6 flex gap-5 cursor-pointer transition-all duration-300 relative border-b border-[var(--ease2event-border-subtle)]/30 ${activeChat === chat.id
                                ? 'bg-[var(--ease2event-bg-elevated)]'
                                : 'hover:bg-[var(--ease2event-bg-elevated)]/50'
                                }`}
                        >
                            {activeChat === chat.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--ease2event-brand-primary)] shadow-[var(--ease2event-shadow-md)]"></div>
                            )}
                            <div className="relative flex-shrink-0">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-black text-xl text-white shadow-xl shadow-blue-500/20 uppercase">
                                    {chat.avatar}
                                </div>
                                {chat.online && (
                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[var(--ease2event-bg-surface)] rounded-full shadow-lg"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-[var(--ease2event-text-primary)] truncate tracking-tight">{chat.name}</h3>
                                    <span className="text-[10px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-widest">{chat.time}</span>
                                </div>
                                <p className={`text-sm tracking-tight truncate ${chat.unread > 0 ? 'text-[var(--ease2event-text-primary)] font-bold' : 'text-[var(--ease2event-text-muted)] font-medium'}`}>{chat.message}</p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="flex flex-col justify-center">
                                    <span className="w-6 h-6 bg-[var(--ease2event-brand-primary)] text-white text-[10px] flex items-center justify-center rounded-lg font-black shadow-lg animate-pulse">
                                        {chat.unread}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`
                flex-1 flex flex-col absolute md:relative inset-0 z-20 bg-[var(--ease2event-bg-surface)] transition-transform duration-500
                ${showMobileChat ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 md:p-8 bg-[var(--ease2event-bg-surface)] border-b border-[var(--ease2event-border-subtle)]">
                            <div className="flex items-center justify-between gap-3 bg-[var(--ease2event-bg-elevated)]/50 p-2 md:p-4 rounded-[2rem] border-2 border-[var(--ease2event-border-subtle)] transition-all shadow-sm">
                                <div className="flex items-center gap-3 md:gap-5 min-w-0">
                                    <button
                                        onClick={handleBackToList}
                                        className="md:hidden w-10 h-10 flex items-center justify-center bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-subtle)] text-[var(--ease2event-text-primary)] hover:bg-[var(--ease2event-bg-elevated)] rounded-xl transition-all shrink-0"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div className="relative shrink-0">
                                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center font-black text-lg md:text-xl text-white shadow-xl shadow-blue-500/10 uppercase">
                                            {activeUser?.avatar}
                                        </div>
                                        {activeUser?.online && (
                                            <span className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 border-2 border-[var(--ease2event-bg-surface)] rounded-full shadow-lg"></span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <h3 className="font-semibold text-sm md:text-xl text-[var(--ease2event-text-primary)] tracking-tight truncate">{activeUser?.name}</h3>
                                            <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                                        </div>
                                        <p className="text-[8px] md:text-[10px] font-black text-[var(--ease2event-text-muted)] flex items-center gap-1.5 md:gap-2 uppercase tracking-widest truncate">
                                            {activeUser?.online ? (
                                                <>
                                                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                                    Active Link
                                                </>
                                            ) : (
                                                'Node Offline'
                                            )}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-8 overflow-y-auto space-y-10 bg-[var(--ease2event-bg-elevated)]/10">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] md:max-w-lg ${message.sender === 'me' ? 'order-2' : 'order-1'} space-y-2`}>
                                        <div
                                            className={`p-6 rounded-[2rem] shadow-xl border ${message.sender === 'me'
                                                ? 'bg-blue-600 border-blue-500/20 text-white rounded-tr-none'
                                                : 'bg-[var(--ease2event-bg-surface)] border-[var(--ease2event-border-subtle)] text-[var(--ease2event-text-primary)] rounded-tl-none font-medium'
                                                }`}
                                        >
                                            <p className="text-base leading-relaxed">{message.text}</p>
                                        </div>
                                        <p className={`text-[10px] font-black uppercase tracking-widest text-[var(--ease2event-text-muted)] mt-1 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                                            {message.time} • Sentinel Protocol
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-3 md:p-8 bg-[var(--ease2event-bg-surface)] border-t border-[var(--ease2event-border-subtle)]">
                            <div className="flex items-center gap-3 md:gap-4 bg-[var(--ease2event-bg-elevated)]/50 p-1 md:p-3 rounded-full border border-[var(--ease2event-border-subtle)] focus-within:border-blue-500/40 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all shadow-inner">
                                <div className="flex items-center gap-0.5 md:gap-0 pl-2 md:pl-0">
                                    <button className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center text-[var(--ease2event-text-muted)] hover:text-blue-500 transition-colors">
                                        <Paperclip size={18} className="md:w-6 md:h-6" />
                                    </button>
                                    <button className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center text-[var(--ease2event-text-muted)] hover:text-blue-500 transition-colors">
                                        <Smile size={18} className="md:w-6 md:h-6" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter transmission..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 bg-transparent border-none outline-none text-[12px] md:text-base font-bold text-[var(--ease2event-text-primary)] placeholder-[var(--ease2event-text-muted)] px-1"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="p-2 text-blue-600 md:text-white md:bg-blue-600 md:w-14 md:h-14 md:rounded-2xl transition-all md:shadow-xl md:shadow-blue-500/20 hover:scale-110 active:scale-90 flex items-center justify-center shrink-0 mr-2 md:mr-1"
                                >
                                    <Send size={18} className="md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-[var(--ease2event-text-muted)] bg-[var(--ease2event-bg-elevated)]/5">
                        <div className="w-24 h-24 bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-500/5 group-hover:scale-150 transition-transform duration-1000" />
                            <Send size={40} className="text-blue-500" />
                        </div>
                        <p className="text-2xl font-normal text-[var(--ease2event-text-primary)] tracking-normal not-italic">Initialize Communication</p>
                        <p className="text-sm font-bold uppercase tracking-widest opacity-60 mt-2">Select a neural node to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
