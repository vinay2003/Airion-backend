import React, { useState } from 'react';
import { Search, Filter, MessageSquare, AlertCircle, CheckCircle, Clock, MoreVertical, Send, User, Reply, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminTickets, useUpdateTicketStatus, useReplyToTicket } from '../hooks/useTickets';

interface Ticket {
    id: string;
    user: string;
    type: 'User' | 'Vendor';
    subject: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    lastUpdated: string;
}

const SupportTickets: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [replyText, setReplyText] = useState('');
    const { data: ticketsData, isLoading } = useAdminTickets();
    const updateStatusMutation = useUpdateTicketStatus();
    const replyMutation = useReplyToTicket();

    const tickets: Ticket[] = ticketsData || [];

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.user.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getPriorityStyles = (priority: Ticket['priority']) => {
        switch (priority) {
            case 'Critical': return 'bg-rose-50 text-rose-600 border-rose-200';
            case 'High': return 'bg-orange-50 text-orange-600 border-orange-200';
            case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'Low': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        }
    };

    const getStatusStyles = (status: Ticket['status']) => {
        switch (status) {
            case 'Open': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'In Progress': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'Resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'Closed': return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-800 dark:border-slate-700';
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim() || !selectedTicket) return;
        await replyMutation.mutateAsync({ id: selectedTicket.id, reply: replyText });
        setReplyText('');
    };

    const updateStatus = async (id: string, newStatus: Ticket['status']) => {
        await updateStatusMutation.mutateAsync({ id, status: newStatus });
        if (selectedTicket && selectedTicket.id === id) {
            setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
    };

    return (
        <div className="fade-in pb-12 flex flex-col h-[calc(100vh-100px)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--ease2event-text-primary)]">Support Tickets</h1>
                    <p className="text-sm font-medium text-[var(--ease2event-text-secondary)] mt-1">Manage user and vendor inquiries</p>
                </div>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
                {/* Tickets List */}
                <div className={`flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl  overflow-hidden w-full lg:w-1/3 flex ${selectedTicket ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-gray-200 dark:border-slate-800 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {['All', 'Open', 'In Progress', 'Resolved'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
                                        statusFilter === status 
                                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400' 
                                        : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 '
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {filteredTickets.map(ticket => (
                            <div 
                                key={ticket.id} 
                                onClick={() => setSelectedTicket(ticket)}
                                className={`p-4 border-b border-gray-100 dark:border-slate-800/50 cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-l-4 border-l-indigo-500' : '  border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-gray-500">{ticket.id}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border ${getPriorityStyles(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{ticket.subject}</h4>
                                <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                        <User size={12} />
                                        <span className="font-medium">{ticket.user}</span>
                                    </div>
                                    <span className="text-gray-400 font-medium">{ticket.lastUpdated}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ticket Details & Chat */}
                <div className={`flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl  overflow-hidden flex-col ${selectedTicket ? 'flex' : 'hidden lg:flex'}`}>
                    {selectedTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-start bg-gray-50/50 dark:bg-slate-900 shrink-0">
                                <div className="flex gap-4">
                                    <button className="lg:hidden p-2 -ml-2 text-gray-500  rounded-lg" onClick={() => setSelectedTicket(null)}>
                                        &larr; Back
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedTicket.subject}</h2>
                                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border ${getStatusStyles(selectedTicket.status)}`}>
                                                {selectedTicket.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><User size={14} /> {selectedTicket.user}</span>
                                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs font-bold">{selectedTicket.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {selectedTicket.status !== 'Resolved' && (
                                        <button onClick={() => updateStatus(selectedTicket.id, 'Resolved')} className="p-2 bg-emerald-50 text-emerald-600  rounded-lg transition-colors" title="Mark Resolved">
                                            <CheckCircle size={18} />
                                        </button>
                                    )}
                                    {selectedTicket.priority === 'Critical' && (
                                        <button className="p-2 bg-rose-50 text-rose-600  rounded-lg transition-colors" title="Escalate">
                                            <AlertTriangle size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Chat History */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-slate-900/50">
                                {/* Customer Message */}
                                <div className="flex gap-4 max-w-[80%]">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                                        {selectedTicket.user[0]}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-gray-900 dark:text-white">{selectedTicket.user}</span>
                                            <span className="text-[10px] text-gray-500">Yesterday, 10:45 AM</span>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none  text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                            Hi Team, I am facing an issue regarding my recent transaction. The amount was deducted but the booking still shows as pending. Can you please look into this urgently?
                                        </div>
                                    </div>
                                </div>

                                {/* Support Reply */}
                                <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center font-bold shrink-0">
                                        A
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 justify-end">
                                            <span className="text-[10px] text-gray-500">Yesterday, 11:30 AM</span>
                                            <span className="text-xs font-bold text-gray-900 dark:text-white">Admin (You)</span>
                                        </div>
                                        <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none  text-sm leading-relaxed">
                                            Hello {selectedTicket.user.split(' ')[0]}, apologies for the inconvenience. We have escalated this to our payment gateway partner. You will receive an update shortly.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reply Input */}
                            <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                                <div className="relative">
                                    <textarea 
                                        rows={3} 
                                        placeholder="Type your reply here..." 
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 pr-16 outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 dark:text-white resize-none"
                                    />
                                    <button 
                                        onClick={handleSendReply}
                                        className="absolute right-4 bottom-4 p-2 bg-indigo-600  text-white rounded-lg transition-colors"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No ticket selected</h3>
                            <p className="text-sm">Select a ticket from the list to view details and reply.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportTickets;
