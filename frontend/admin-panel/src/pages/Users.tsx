import React, { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Mail, Phone, Calendar } from 'lucide-react';
import api from '../lib/api';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    joined: string;
    status: 'Active' | 'Inactive';
}

const Users: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-500 dark:text-slate-400">Manage platform users and their activities</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 w-64 text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {user.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{user.name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.status === 'Active'
                                        ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                                        : 'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                            <button className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                <Mail size={16} className="text-gray-400 dark:text-slate-500" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                <Phone size={16} className="text-gray-400 dark:text-slate-500" />
                                {user.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                <Calendar size={16} className="text-gray-400 dark:text-slate-500" />
                                Joined {user.joined}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <button className="text-red-500 dark:text-red-400 text-sm font-medium hover:underline">View Details</button>
                            <button className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors">
                                Manage
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                    <Search size={48} className="mx-auto text-gray-300 dark:text-slate-700 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
                    <p className="text-gray-500 dark:text-slate-400">Try adjusting your search query</p>
                </div>
            )}
        </div>
    );
};

export default Users;
