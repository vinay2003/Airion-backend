import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Bell, ChevronLeft, ChevronRight, LogOut, User, Settings, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NavItem {
    label: string;
    icon: React.ElementType;
    path: string;
    count?: number;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    navItems: NavItem[];
    user: {
        name: string;
        role: string;
        avatar?: string;
    };
    logo?: React.ReactNode;
    onLogout?: () => void;
    currentPath: string;
    LinkComponent: React.ElementType;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    navItems,
    user,
    logo,
    onLogout,
    currentPath,
    LinkComponent
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Responsive handling
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initialize

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className="min-h-screen bg-[var(--ease2event-bg-base)] text-[var(--ease2event-text-primary)] font-sans flex overflow-hidden">
            
            {/* MOBILE SIDEBAR DRAWER */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] bg-[var(--ease2event-bg-sidebar)] border-r border-[var(--ease2event-border-subtle)] z-[70] lg:hidden flex flex-col"
                        >
                            <SidebarContent 
                                navItems={navItems} 
                                currentPath={currentPath} 
                                LinkComponent={LinkComponent}
                                isCollapsed={false}
                                logo={logo}
                                onClose={() => setIsMobileMenuOpen(false)}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* DESKTOP SIDEBAR */}
            <aside className={`
                hidden lg:flex flex-col bg-[var(--ease2event-bg-sidebar)] border-r border-[var(--ease2event-border-subtle)] transition-all duration-300 ease-in-out relative z-50
                ${isSidebarOpen ? 'w-[260px]' : 'w-[80px]'}
            `}>
                <SidebarContent 
                    navItems={navItems} 
                    currentPath={currentPath} 
                    LinkComponent={LinkComponent}
                    isCollapsed={!isSidebarOpen}
                    logo={logo}
                />
                
                {/* Collapse Toggle Button */}
                <button 
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-20 w-6 h-6 bg-[var(--ease2event-brand-primary)] text-white rounded-full flex items-center justify-center shadow-lg border border-white/10 hover:scale-110 transition-transform"
                >
                    {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                
                {/* TOPBAR */}
                <header className="h-[70px] bg-[var(--ease2event-bg-base)]/80 backdrop-blur-md border-b border-[var(--ease2event-border-subtle)] px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 text-[var(--ease2event-text-secondary)] hover:text-[var(--ease2event-brand-primary)] transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        
                        <div className="hidden md:flex items-center relative group">
                            <Search size={18} className="absolute left-3 text-[var(--ease2event-text-muted)] group-focus-within:text-[var(--ease2event-brand-primary)] transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search everything..." 
                                className="bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-subtle)] rounded-xl pl-10 pr-4 py-2 text-sm w-[240px] focus:w-[320px] focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 focus:border-[var(--ease2event-brand-primary)] outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-5">
                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="p-2.5 text-[var(--ease2event-text-secondary)] hover:bg-[var(--ease2event-bg-surface)] rounded-xl transition-all relative"
                            >
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--ease2event-brand-danger)] rounded-full border-2 border-[var(--ease2event-bg-base)]"></span>
                            </button>
                        </div>

                        {/* User Profile */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-3 p-1 pl-1 pr-3 hover:bg-[var(--ease2event-bg-surface)] rounded-2xl border border-transparent )] transition-all"
                            >
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--ease2event-brand-primary)] to-[var(--ease2event-brand-secondary)] flex items-center justify-center text-white font-bold text-sm shadow-lg overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name.charAt(0)
                                    )}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-xs font-bold leading-none">{user.name}</p>
                                    <p className="text-[10px] text-[var(--ease2event-text-muted)] font-medium mt-1 uppercase tracking-wider">{user.role}</p>
                                </div>
                            </button>

                            {/* Dropdown Menu (Simplified for brevity but styled premium) */}
                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-56 bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-base)] rounded-2xl shadow-2xl p-2 z-20"
                                        >
                                            <div className="p-3 border-b border-[var(--ease2event-border-subtle)] mb-1">
                                                <p className="text-sm font-bold">{user.name}</p>
                                                <p className="text-xs text-[var(--ease2event-text-muted)]">{user.role}</p>
                                            </div>
                                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[var(--ease2event-text-secondary)] hover:bg-[var(--ease2event-bg-surface)] hover:text-white transition-all">
                                                <User size={16} /> Profile
                                            </button>
                                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[var(--ease2event-text-secondary)] hover:bg-[var(--ease2event-bg-surface)] hover:text-white transition-all">
                                                <Settings size={16} /> Settings
                                            </button>
                                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[var(--ease2event-text-secondary)] hover:bg-[var(--ease2event-bg-surface)] hover:text-white transition-all">
                                                <HelpCircle size={16} /> Help Center
                                            </button>
                                            <div className="h-px bg-[var(--ease2event-border-subtle)] my-1" />
                                            <button 
                                                onClick={onLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[var(--ease2event-brand-danger)] hover:bg-[var(--ease2event-brand-danger)]/10 transition-all font-bold"
                                            >
                                                <LogOut size={16} /> Sign Out
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE CONTENT */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
};

// HELPER COMPONENT: SIDEBAR CONTENT
const SidebarContent: React.FC<{
    navItems: NavItem[];
    currentPath: string;
    LinkComponent: React.ElementType;
    isCollapsed: boolean;
    logo?: React.ReactNode;
    onClose?: () => void;
}> = ({ navItems, currentPath, LinkComponent, isCollapsed, logo, onClose }) => {
    return (
        <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className={`h-[70px] flex items-center border-b border-[var(--ease2event-border-subtle)] px-6 overflow-hidden ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className="flex items-center gap-3 min-w-max">
                    {logo || (
                        <>
                            <div className="w-8 h-8 bg-[var(--ease2event-brand-primary)] rounded-lg flex items-center justify-center text-white font-black shadow-lg">A</div>
                            {!isCollapsed && <span className="text-xl font-black tracking-tight text-white">Ease2event</span>}
                        </>
                    )}
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 text-[var(--ease2event-text-secondary)] lg:hidden">
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Nav Menu */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
                    
                    return (
                        <LinkComponent 
                            key={item.path} 
                            to={item.path} 
                            onClick={onClose}
                            className={`
                                flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                                ${isActive 
                                    ? 'bg-[var(--ease2event-brand-primary)]/10 text-[var(--ease2event-brand-primary)] font-bold' 
                                    : 'text-[var(--ease2event-text-secondary)] hover:bg-white/5 hover:text-white'
                                }
                                ${isCollapsed ? 'justify-center' : ''}
                            `}
                        >
                            {/* Active Indicator */}
                            {isActive && !isCollapsed && (
                                <motion.div 
                                    layoutId="nav-active"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[var(--ease2event-brand-primary)] rounded-r-full"
                                />
                            )}
                            
                            <item.icon 
                                size={20} 
                                className={`shrink-0 ${isActive ? 'text-[var(--ease2event-brand-primary)]' : 'text-[var(--ease2event-text-muted)] group-hover:text-white transition-colors'}`} 
                            />
                            
                            {!isCollapsed && (
                                <span className="text-sm truncate">{item.label}</span>
                            )}

                            {item.count && !isCollapsed && (
                                <span className="ml-auto bg-[var(--ease2event-brand-primary)] text-white text-[10px] px-2 py-0.5 rounded-full">
                                    {item.count}
                                </span>
                            )}

                            {/* Tooltip for collapsed mode */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] shadow-xl">
                                    {item.label}
                                </div>
                            )}
                        </LinkComponent>
                    );
                })}
            </nav>

            {/* Footer / App Details */}
            {!isCollapsed && (
                <div className="p-4 border-t border-[var(--ease2event-border-subtle)]">
                    <div className="bg-gradient-to-br from-[var(--ease2event-bg-elevated)] to-[var(--ease2event-bg-surface)] p-4 rounded-2xl border border-[var(--ease2event-border-subtle)] shadow-inner">
                        <p className="text-[10px] text-[var(--ease2event-text-muted)] font-bold uppercase tracking-widest mb-2">Platform Version</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">v1.2.4-stable</span>
                            <div className="w-1.5 h-1.5 bg-[var(--ease2event-brand-green)] rounded-full animate-pulse shadow-[0_0_8px_var(--ease2event-brand-green)]" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
