import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Send, Paperclip, Smile, Phone, Video, Info, ArrowLeft, User, ShieldCheck } from 'lucide-react';
import { Button } from '@ease2event/ui';
import { leadService } from '@ease2event/shared/lib/services/leadService';
import { useQuery } from '@tanstack/react-query';

const Inbox: React.FC = () => {
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [showMobileChat, setShowMobileChat] = useState(false);

    const { data: leads, isLoading } = useQuery({
        queryKey: ['vendor-leads'],
        queryFn: () => leadService.getVendorLeads().catch(() => []),
    });

    const activeUser = leads?.find(lead => lead.id === activeChat);
    const filteredChats = (leads || []).filter(lead =>
        lead.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.notes?.toLowerCase().includes(searchQuery.toLowerCase())
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
                    {isLoading ? (
                        <div className="p-8 text-center text-sm font-bold uppercase tracking-widest opacity-40">Scanning for nodes...</div>
                    ) : (
                    filteredChats.map((lead) => (
                        <div
                            key={lead.id}
                            onClick={() => handleChatSelect(lead.id)}
                            className={`p-6 flex gap-5 cursor-pointer transition-all duration-300 relative border-b border-[var(--ease2event-border-subtle)]/30 ${activeChat === lead.id
                                ? 'bg-[var(--ease2event-bg-elevated)]'
                                : 'hover:bg-[var(--ease2event-bg-elevated)]/50'
                                }`}
                        >
                            {activeChat === lead.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--ease2event-brand-primary)] shadow-[var(--ease2event-shadow-md)]"></div>
                            )}
                            <div className="relative flex-shrink-0">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-black text-xl text-white shadow-xl shadow-blue-500/20 uppercase">
                                    {(lead.user?.name || 'C')[0]}
                                </div>
                                {lead.aiScore > 75 && (
                                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 border-2 border-[var(--ease2event-bg-surface)] rounded-full shadow-lg flex items-center justify-center text-[8px] text-white font-black">🔥</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-[var(--ease2event-text-primary)] truncate tracking-tight">{lead.user?.name || 'Customer'}</h3>
                                    <span className="text-[10px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-widest">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className={`text-sm tracking-tight truncate ${lead.status === 'pending' ? 'text-[var(--ease2event-text-primary)] font-bold' : 'text-[var(--ease2event-text-muted)] font-medium'}`}>
                                    {lead.notes || 'Enquiry about services...'}
                                </p>
                            </div>
                            <div className="flex flex-col justify-center gap-1">
                                <div className="text-[9px] font-black text-blue-500 text-center">{lead.aiScore}%</div>
                                <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${lead.aiScore}%` }}></div>
                                </div>
                            </div>
                        </div>
                    )))}
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
                                            {(activeUser?.user?.name || 'C')[0]}
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <h3 className="font-bold text-sm md:text-xl text-[var(--ease2event-text-primary)] tracking-tight uppercase truncate">{activeUser?.user?.name || 'Customer'}</h3>
                                            <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                                        </div>
                                        <p className="text-[8px] md:text-[10px] font-black text-[var(--ease2event-text-muted)] flex items-center gap-1.5 md:gap-2 uppercase tracking-widest truncate">
                                            Lead Score: {activeUser?.aiScore}% • {activeUser?.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="px-4 py-2 rounded-full border-blue-500/20 text-blue-500 invisible md:visible bg-white/5 backdrop-blur-md">
                                        ₹{activeUser?.budget?.toLocaleString()}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area - Show Lead Details */}
                        <div className="flex-1 p-8 overflow-y-auto space-y-10 bg-[var(--ease2event-bg-elevated)]/10">
                            <div className="flex justify-center">
                                <div className="bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-subtle)] p-8 rounded-[2rem] max-w-xl w-full shadow-2xl relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
                                     <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Original Transmission</h4>
                                     <div className="grid grid-cols-2 gap-8 mb-8">
                                         <div>
                                             <p className="text-[10px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-widest mb-1">Event Date</p>
                                             <p className="text-lg font-bold text-[var(--ease2event-text-primary)]">{activeUser ? new Date(activeUser.eventDate).toLocaleDateString() : 'TBD'}</p>
                                         </div>
                                         <div>
                                             <p className="text-[10px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-widest mb-1">Guests</p>
                                             <p className="text-lg font-bold text-[var(--ease2event-text-primary)]">{activeUser?.guestsCount || 'Not specified'}</p>
                                         </div>
                                     </div>
                                     <div className="space-y-4">
                                         <p className="text-[10px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-widest leading-none">Intelligence Notes</p>
                                         <p className="text-md text-[var(--ease2event-text-secondary)] font-medium leading-relaxed italic border-l-4 border-blue-500 pl-6 py-2 bg-blue-500/5 rounded-r-2xl">
                                             "{activeUser?.notes || 'No specific notes provided by the customer.'}"
                                         </p>
                                     </div>
                                     <div className="mt-8 pt-8 border-t border-[var(--ease2event-border-subtle)]/50">
                                         <div className="flex items-center gap-3 text-emerald-500 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                                             <Info size={16} />
                                             <p className="text-[10px] font-black uppercase tracking-widest">AI Reasoning: {activeUser?.aiReasoning}</p>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="p-3 md:p-8 bg-[var(--ease2event-bg-surface)] border-t border-[var(--ease2event-border-subtle)]">
                            <div className="flex items-center gap-3 md:gap-4 bg-[var(--ease2event-bg-elevated)]/50 p-1 md:p-3 rounded-full border border-[var(--ease2event-border-subtle)] focus-within:border-blue-500/40 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all shadow-inner">
                                <div className="flex items-center gap-0.5 md:gap-0 pl-2 md:pl-0">
                                    <button className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center text-[var(--ease2event-text-muted)] hover:text-blue-500 transition-colors">
                                        <Paperclip size={18} className="md:w-6 md:h-6" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter response transmission..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
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
                        <p className="text-2xl font-black text-[var(--ease2event-text-primary)] uppercase tracking-tight italic">Initialize Communication</p>
                        <p className="text-sm font-bold uppercase tracking-widest opacity-60 mt-2">Select a neural node to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
