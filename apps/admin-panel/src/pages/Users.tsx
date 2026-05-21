import React, { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Mail, Phone, Calendar, Shield, User as UserIcon } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
    role: string;
    status?: 'Active' | 'Inactive';
}

/**
 * 👥 User Management: Administrative Matrix
 * Provides a high-fidelity interface for monitoring and managing platform identities.
 * Ensures strict separation between standard users and administrative nodes.
 */
const Users: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // 🔍 Fetch only users with 'user' role for this section
                const data = await api.get('/users?role=user') as any;
                if (Array.isArray(data)) {
                    setUsers(data);
                } else if (data && Array.isArray(data.data)) {
                    setUsers(data.data);
                } else {
                    setUsers([]);
                }
            } catch (error: any) {
                setError(error.message);
                toast.error('Identity registry sync failed: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = (users || []).filter(user => {
        const name = user.name || '';
        const email = user.email || '';
        const phone = user.phoneNumber || '';
        const query = searchQuery.toLowerCase();
        
        return name.toLowerCase().includes(query) || 
               email.toLowerCase().includes(query) ||
               phone.includes(query);
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-red-500/10 border-t-red-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <UserIcon className="text-red-600/40" size={24} />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center">
                <div className="p-6 bg-red-500/10 rounded-full">
                    <Shield className="text-red-500" size={48} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Error loading users</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs">{error}</p>
                </div>
                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-neutral-900 transition-all shadow-xl shadow-red-500/20">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Users</h1>
                    <p className="text-sm font-medium text-gray-400 dark:text-slate-500 mt-2">{users.length} users registered</p>
                </div>
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 h-14 border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium text-sm dark:text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="group relative bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-gray-50 dark:border-slate-800 hover:border-red-500/30 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-red-500/20 uppercase">
                                    {(user.name || 'U')[0]}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white tracking-tight truncate max-w-[140px] leading-none mb-2">{user.name || 'Unnamed user'}</h3>
                                    <span className="text-xs px-3 py-1 rounded-full font-medium capitalize bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                <MoreHorizontal size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4 group/item">
                                <div className="p-2.5 bg-neutral-50 dark:bg-slate-800/50 rounded-xl group-hover/item:bg-red-500 group-hover/item:text-white transition-colors">
                                    <Mail size={14} />
                                </div>
                                <span className="text-xs font-medium text-gray-500 dark:text-slate-400 truncate tracking-tight">{user.email || 'No email'}</span>
                            </div>
                            <div className="flex items-center gap-4 group/item">
                                <div className="p-2.5 bg-neutral-50 dark:bg-slate-800/50 rounded-xl group-hover/item:bg-red-500 group-hover/item:text-white transition-colors">
                                    <Phone size={14} />
                                </div>
                                <span className="text-xs font-medium text-gray-500 dark:text-slate-400 tracking-tight">{user.phoneNumber || 'No phone'}</span>
                            </div>
                            <div className="flex items-center gap-4 group/item">
                                <div className="p-2.5 bg-neutral-50 dark:bg-slate-800/50 rounded-xl group-hover/item:bg-red-500 group-hover/item:text-white transition-colors">
                                    <Calendar size={14} />
                                </div>
                                <span className="text-xs font-medium text-gray-400 dark:text-slate-500 tracking-tight">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50 dark:border-slate-800 flex gap-3">
                            <button className="flex-1 h-12 bg-neutral-900 dark:bg-white dark:text-neutral-950 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all">
                                Analyze
                            </button>
                            <button className="h-12 px-6 bg-neutral-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all active:scale-95">
                                Manage
                            </button>
                        </div>
                   </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="p-8 bg-neutral-50 dark:bg-slate-900 rounded-[40px] border border-neutral-100 dark:border-slate-800">
                        <Search size={48} className="text-gray-300 dark:text-slate-700" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">No users found</h3>
                        <p className="text-sm font-medium text-gray-400 dark:text-slate-500">Try adjusting your search</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;

