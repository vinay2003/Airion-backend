import React, { useState } from 'react';
import { Search, MoreVertical, Send, Paperclip, Smile, Phone, Video, Info, ArrowLeft } from 'lucide-react';

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
            // Handle message sending logic here
            setMessageInput('');
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden flex transition-colors duration-300 relative">
            {/* Chat List */}
            <div className={`
                w-full md:w-80 border-r border-gray-100 dark:border-slate-800 flex flex-col absolute md:relative inset-0 z-10 bg-white dark:bg-slate-900 transition-transform duration-300
                ${showMobileChat ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
            `}>
                {/* Search Header */}
                <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 transition-all"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => handleChatSelect(chat.id)}
                            className={`p-4 flex gap-3 cursor-pointer transition-all duration-200 ${activeChat === chat.id
                                ? 'bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500'
                                : 'hover:bg-gray-50 dark:hover:bg-slate-800 border-l-4 border-transparent'
                                }`}
                        >
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center font-bold text-white shadow-md">
                                    {chat.avatar}
                                </div>
                                {chat.online && (
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{chat.name}</h3>
                                    <span className="text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap ml-2">{chat.time}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{chat.message}</p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="flex flex-col justify-center">
                                    <span className="w-6 h-6 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-bold shadow-md">
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
                flex-1 flex flex-col absolute md:relative inset-0 z-20 bg-white dark:bg-slate-900 transition-transform duration-300
                ${showMobileChat ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleBackToList}
                                    className="md:hidden p-2 -ml-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center font-bold text-white">
                                        {activeUser?.avatar}
                                    </div>
                                    {activeUser?.online && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{activeUser?.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                                        {activeUser?.online ? (
                                            <>
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                Online
                                            </>
                                        ) : (
                                            'Offline'
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-600 dark:text-slate-400 transition-colors">
                                    <Phone size={20} />
                                </button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-600 dark:text-slate-400 transition-colors">
                                    <Video size={20} />
                                </button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-600 dark:text-slate-400 transition-colors">
                                    <Info size={20} />
                                </button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-500 dark:text-slate-400 transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-slate-950/50">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] md:max-w-md ${message.sender === 'me' ? 'order-2' : 'order-1'}`}>
                                        <div
                                            className={`p-3 rounded-2xl shadow-sm ${message.sender === 'me'
                                                ? 'bg-red-500 text-white rounded-tr-none'
                                                : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-200 rounded-tl-none border border-gray-100 dark:border-slate-700'
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{message.text}</p>
                                        </div>
                                        <p className={`text-xs text-gray-400 dark:text-slate-500 mt-1 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                                            {message.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 p-2 rounded-xl border border-gray-100 dark:border-slate-700 focus-within:border-red-500 dark:focus-within:border-red-400 transition-all">
                                <button className="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                                    <Paperclip size={20} />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 bg-transparent outline-none text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500"
                                />
                                <button className="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                                    <Smile size={20} />
                                </button>
                                <button
                                    onClick={handleSendMessage}
                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 transform"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 bg-gray-50/50 dark:bg-slate-950/50">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Send size={32} />
                        </div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">Select a chat to start messaging</p>
                        <p className="text-sm">Choose from your existing conversations</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
