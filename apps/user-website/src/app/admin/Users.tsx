import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Mail, Phone, Calendar, Shield, Trash2, Ban, CheckCircle, XCircle } from 'lucide-react';
import api from '../lib/api';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    joined: string;
    status: 'Active' | 'Banned' | 'Inactive';
}

const Users: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('All');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Mock data for now if API fails or for demo
                const mockUsers: User[] = [
                    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543210', joined: '2023-10-12', status: 'Active' },
                    { id: 2, name: 'Priya Singh', email: 'priya@example.com', phone: '+91 8765432109', joined: '2023-11-05', status: 'Active' },
                    { id: 3, name: 'Amit Verma', email: 'amit@example.com', phone: '+91 7654321098', joined: '2023-12-20', status: 'Banned' },
                    { id: 4, name: 'Sneha Gupta', email: 'sneha@example.com', phone: '+91 6543210987', joined: '2024-01-15', status: 'Active' },
                    { id: 5, name: 'Vikram Mehta', email: 'vikram@example.com', phone: '+91 5432109876', joined: '2024-02-10', status: 'Inactive' },
                ];
                
                try {
                    const response: any = await api.get('/users');
                    setUsers(response.data.length > 0 ? response.data : mockUsers);
                } catch (e) {
                    setUsers(mockUsers);
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleStatusChange = async (userId: number, newStatus: User['status']) => {
        try {
            // await api.patch(`/users/${userId}/status`, { status: newStatus });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        } catch (error: any) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                // await api.delete(`/users/${userId}`);
                setUsers(prev => prev.filter(u => u.id !== userId));
            } catch (error: any) {
                alert('Failed to delete user');
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'All' || user.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">User Management</h1>
                    <p className="text-gray-500 dark:text-slate-400">Total registered users: <span className="font-bold text-gray-900 dark:text-white">{users.length}</span></p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 text-gray-900 dark:text-white"
                        />
                    </div>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 text-gray-700 dark:text-slate-300 font-bold text-xs uppercase"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Banned">Banned</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">User Info</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Contact</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Joined Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold shadow-md">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white uppercase tracking-tight text-sm">{user.name}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase">ID: #{user.id.toString().padStart(4, '0')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                                                <Mail size={14} className="text-red-500" />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-xs font-medium">
                                                <Phone size={14} className="text-red-500" />
                                                {user.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                                            <Calendar size={14} className="text-gray-400" />
                                            {user.joined}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                                            user.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            user.status === 'Banned' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleStatusChange(user.id, user.status === 'Banned' ? 'Active' : 'Banned')}
                                                className={`p-2 rounded-xl transition-colors ${
                                                    user.status === 'Banned' 
                                                    ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                                                    : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                                }`}
                                                title={user.status === 'Banned' ? 'Unban User' : 'Ban User'}
                                            >
                                                {user.status === 'Banned' ? <CheckCircle size={18} /> : <Ban size={18} />}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Placeholder */}
                <div className="p-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-widest">
                    <span>Showing 1-{filteredUsers.length} of {users.length} users</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
            
            {filteredUsers.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <Search size={40} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">No users found</h3>
                    <p className="text-gray-500 dark:text-slate-400">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            )}
        </div>
    );
};

export default Users;
