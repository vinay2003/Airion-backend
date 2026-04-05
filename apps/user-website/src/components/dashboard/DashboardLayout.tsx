import React, { useState, useEffect } from 'react';
import { 
    Menu, X, Search, Bell, ChevronLeft, ChevronRight, LogOut, User, 
    LayoutDashboard, Calendar, Bookmark, MessageSquare, PieChart, 
    Settings, Package, Users, ShieldAlert, FileText, ShoppingBag, 
    Zap, Headphones, Sparkles, PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@airion/shared/auth';

type Role = 'USER' | 'VENDOR' | 'ADMIN';

interface NavItem {
    label: string;
    icon: any;
    path: string;
    count?: number;
}

const NAV_CONFIG: Record<Role, NavItem[]> = {
    USER: [
        { label: 'Event Hub', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'My Bookings', icon: Calendar, path: '/dashboard/bookings' },
        { label: 'Saved Vendors', icon: Bookmark, path: '/dashboard/saved' },
        { label: 'Messages', icon: MessageSquare, path: '/dashboard/messages', count: 2 },
        { label: 'Budget Strategist', icon: PieChart, path: '/dashboard/budget' },
        { label: 'Account Settings', icon: Settings, path: '/dashboard/settings' },
    ],
    VENDOR: [
        { label: 'Control Center', icon: LayoutDashboard, path: '/vendor' },
        { label: 'Inventory', icon: Package, path: '/vendor/listings' },
        { label: 'Order Pipeline', icon: Calendar, path: '/vendor/bookings' },
        { label: 'Client Comms', icon: MessageSquare, path: '/vendor/messages', count: 5 },
        { label: 'Business Profile', icon: User, path: '/vendor/profile' },
        { label: 'Configuration', icon: Settings, path: '/vendor/settings' },
    ],
    ADMIN: [
        { label: 'Node Overview', icon: LayoutDashboard, path: '/admin' },
        { label: 'User Directory', icon: Users, path: '/admin/users' },
        { label: 'Vendor Directory', icon: ShoppingBag, path: '/admin/vendors' },
        { label: 'Intel Moderation', icon: ShieldAlert, path: '/admin/moderation', count: 3 },
        { label: 'CMS Terminal', icon: FileText, path: '/admin/cms' },
        { label: 'Core Integrity', icon: Settings, path: '/admin/settings' },
    ]
};

const DashboardLayout: React.FC<{ portalRole: Role }> = ({ portalRole }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const navItems = NAV_CONFIG[portalRole];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 flex overflow-hidden font-sans selection:bg-red-500 selection:text-white">
            
            {/* MOBILE SIDEBAR DRAWER */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            className="fixed top-0 left-0 bottom-0 w-[300px] bg-white border-r border-slate-100 z-[70] lg:hidden flex flex-col shadow-2xl"
                        >
                            <SidebarContent items={navItems} currentPath={location.pathname} isCollapsed={false} portalRole={portalRole} onClose={() => setIsMobileMenuOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* DESKTOP SIDEBAR */}
            <aside className={`hidden lg:flex flex-col bg-white border-r border-slate-50 transition-all duration-500 ease-in-out relative z-50 ${isSidebarOpen ? 'w-[280px]' : 'w-[100px]'}`}>
                <SidebarContent items={navItems} currentPath={location.pathname} isCollapsed={!isSidebarOpen} portalRole={portalRole} />
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-24 w-7 h-7 bg-white border border-slate-100 text-slate-400 rounded-full flex items-center justify-center shadow-2xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all hover:scale-110 active:scale-95"
                >
                    {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="h-24 bg-white/80 backdrop-blur-2xl border-b border-slate-50 px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-red-50 transition-colors"><Menu size={24} /></button>
                        <div className="hidden md:flex items-center relative group">
                            <Search size={18} className="absolute left-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Universal Command Search..." 
                                className="bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-3.5 text-xs font-black uppercase tracking-widest w-80 focus:w-96 outline-none transition-all focus:ring-4 focus:ring-red-500/5 placeholder:text-slate-300" 
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="p-3.5 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all relative group">
                            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-3 right-3 w-3 h-3 bg-red-600 rounded-full border-4 border-white shadow-lg"></span>
                        </button>

                        <div className="h-10 w-px bg-slate-100 hidden sm:block"></div>

                        <div className="relative">
                            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-4 p-1.5 hover:bg-slate-50 rounded-[1.5rem] transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-slate-900/10 group-hover:bg-red-600 transition-colors">{user?.name?.charAt(0) || 'A'}</div>
                                <div className="hidden sm:block text-left pr-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none">{user?.name}</p>
                                    <p className="text-[10px] text-slate-300 font-bold mt-1 uppercase tracking-widest italic">{portalRole} NODE ACTIVE</p>
                                </div>
                            </button>
                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                                        <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }} className="absolute right-0 mt-4 w-64 bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-3 z-20">
                                            <div className="p-4 bg-slate-50 rounded-2xl mb-2 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black">{portalRole[0]}</div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-black uppercase tracking-tight truncate">{user?.name}</p>
                                                    <p className="text-[10px] text-slate-400 truncate tracking-widest uppercase font-bold">{user?.email}</p>
                                                </div>
                                            </div>
                                            <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:text-red-600 transition-all"><User size={18} /> Credentials</button>
                                            <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:text-red-600 transition-all"><Zap size={18} /> System Audit</button>
                                            <div className="h-px bg-slate-50 my-2"></div>
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-black text-red-600 uppercase tracking-widest hover:bg-red-50 transition-all"><LogOut size={18} /> Secure Eject</button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 md:p-14 bg-white transition-all custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const SidebarContent: React.FC<{ items: NavItem[], currentPath: string, isCollapsed: boolean, portalRole: Role, onClose?: () => void }> = ({ items, currentPath, isCollapsed, portalRole, onClose }) => (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
        {/* LOGO SECTION */}
        <div className={`h-24 flex items-center px-10 ${isCollapsed ? 'justify-center border-none' : 'justify-start'}`}>
            <Link to="/" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-red-600 rounded-[1.25rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-red-600/20 group-hover:rotate-6 group-hover:scale-110 transition-all ring-4 ring-red-50">A</div>
                {!isCollapsed && (
                    <div className="flex flex-col">
                        <span className="text-3xl font-black tracking-tighter uppercase text-slate-900 group-hover:text-red-600 transition-colors">Airion</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 leading-none mt-1">Core Terminal</span>
                    </div>
                )}
            </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 py-12 px-6 space-y-3 overflow-y-auto custom-scrollbar">
            {!isCollapsed && <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.4em] mb-6 pl-4">Platform Nav</p>}
            {items.map((item) => {
                const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
                return (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        onClick={onClose} 
                        className={`flex items-center gap-5 px-5 py-4 rounded-[1.5rem] transition-all relative group origin-left ${
                            isActive 
                            ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 scale-105' 
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        {isActive && !isCollapsed && (
                             <motion.div layoutId="sidebar-active" className="absolute -left-6 w-2 h-8 bg-red-600 rounded-r-full" />
                        )}
                        <item.icon size={20} className={isActive ? 'text-red-500' : 'text-slate-300 group-hover:text-red-500 transition-colors'} />
                        {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>}
                        {item.count && !isCollapsed && (
                            <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-lg shadow-red-500/20">{item.count}</span>
                        )}
                    </Link>
                );
            })}
        </nav>

        {/* FOOTER WIDGET */}
        {!isCollapsed && (
            <div className="p-8">
                <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2.5 bg-red-600 text-white rounded-2xl"><PlusCircle size={18} /></div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">New Record</p>
                    </div>
                    <button className="w-full py-4 bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest rounded-2xl hover:bg-red-600 hover:border-red-600 transition-all shadow-inner active:scale-95">Initiate Add</button>
                    <div className="mt-6 flex items-center gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        <Sparkles size={12} className="text-red-500 animate-pulse" /> AI Logic Ready
                    </div>
                </div>
            </div>
        )}
    </div>
);

export default DashboardLayout;
