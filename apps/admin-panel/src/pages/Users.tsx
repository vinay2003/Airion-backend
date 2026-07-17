import React, { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Mail, Phone, Calendar, Shield, User as UserIcon, AlertCircle, Clock, MapPin, Activity, X, Ban, Unlock } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
    role: string;
    status?: 'Active' | 'Inactive' | 'Blocked';
    lastLogin?: string;
    device?: string;
}

const Users: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        // Simulating the API fetch with enriched mock data for v2.0
        const fetchUsers = async () => {
            try {
                // Mocking data since API might not have all fields yet
                const mockUsers: User[] = [
                    { id: '1', name: 'Amit Sharma', email: 'amit@example.com', phoneNumber: '+91 9876543210', createdAt: '2023-01-15T10:00:00Z', role: 'user', status: 'Active', lastLogin: '2 mins ago', device: 'iPhone 14 Pro' },
                    { id: '2', name: 'Priya Patel', email: 'priya@example.com', phoneNumber: '+91 8765432109', createdAt: '2023-03-22T14:30:00Z', role: 'user', status: 'Inactive', lastLogin: '2 weeks ago', device: 'Windows PC' },
                    { id: '3', name: 'Rahul Kumar', email: 'rahul@example.com', phoneNumber: '+91 7654321098', createdAt: '2023-05-10T09:15:00Z', role: 'user', status: 'Blocked', lastLogin: '1 month ago', device: 'MacBook Air' },
                    { id: '4', name: 'Sneha Gupta', email: 'sneha@example.com', phoneNumber: '+91 6543210987', createdAt: '2023-08-05T16:45:00Z', role: 'user', status: 'Active', lastLogin: '5 hours ago', device: 'Android' },
                ];
                setTimeout(() => {
                    setUsers(mockUsers);
                    setLoading(false);
                }, 800);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const query = searchQuery.toLowerCase();
        return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query) || user.phoneNumber.includes(query);
    });

    const toggleBlockStatus = (user: User) => {
        setUsers(users.map(u => {
            if (u.id === user.id) {
                return { ...u, status: u.status === 'Blocked' ? 'Active' : 'Blocked' };
            }
            return u;
        }));
        setSelectedUser(prev => prev && prev.id === user.id ? { ...prev, status: prev.status === 'Blocked' ? 'Active' : 'Blocked' } : prev);
        toast.success(`User ${user.status === 'Blocked' ? 'unblocked' : 'blocked'} successfully`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <AlertCircle className="text-red-500" size={48} />
                <h3 className="text-xl font-bold">Error loading users</h3>
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--ease2event-text-primary)]">User Management</h1>
                    <p className="text-sm font-medium text-[var(--ease2event-text-secondary)] mt-1">Manage and monitor platform users</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Last Login</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer" onClick={() => setSelectedUser(user)}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 dark:text-white">{user.name}</p>
                                                <p className="text-xs text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-900 dark:text-white font-medium">{user.email}</p>
                                        <p className="text-xs text-gray-500">{user.phoneNumber}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                                            user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                            user.status === 'Blocked' ? 'bg-red-50 text-red-600' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-900 dark:text-white font-medium">{user.lastLogin}</p>
                                        <p className="text-xs text-gray-500">{user.device}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}>
                                            <MoreHorizontal size={18} className="text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No users found.</div>
                )}
            </div>

            {/* Profile Drawer */}
            {selectedUser && (
                <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedUser(null)}></div>
                    <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform border-l border-gray-200 dark:border-slate-800 flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">User Profile</h2>
                            <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-2xl">
                                    {selectedUser.name[0]}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                                    <span className={`inline-flex mt-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                                            selectedUser.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                            selectedUser.status === 'Blocked' ? 'bg-red-50 text-red-600' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                        {selectedUser.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Contact Information</h4>
                                    <div className="space-y-3 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <Mail size={16} className="text-gray-400" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{selectedUser.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone size={16} className="text-gray-400" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{selectedUser.phoneNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin size={16} className="text-gray-400" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Mumbai, India (IP detected)</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Security & Device</h4>
                                    <div className="space-y-3 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <Clock size={16} className="text-gray-400" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Last login: {selectedUser.lastLogin}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Shield size={16} className="text-gray-400" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Device: {selectedUser.device}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Activity Heatmap</h4>
                                    <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800 h-32 flex items-center justify-center">
                                        <div className="text-center">
                                            <Activity size={24} className="text-indigo-400 mx-auto mb-2" />
                                            <p className="text-xs text-gray-500 font-medium">Heatmap visualization will render here.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
                            <button 
                                onClick={() => toggleBlockStatus(selectedUser)}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-colors ${
                                    selectedUser.status === 'Blocked' 
                                    ? 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900' 
                                    : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                                }`}
                            >
                                {selectedUser.status === 'Blocked' ? <Unlock size={18} /> : <Ban size={18} />}
                                {selectedUser.status === 'Blocked' ? 'Unblock User' : 'Block User'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Users;
